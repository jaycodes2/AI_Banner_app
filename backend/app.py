from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required,
    get_jwt_identity
)
from flask_jwt_extended.exceptions import NoAuthorizationError
import bcrypt
import os
import datetime
import uuid
import werkzeug
from dotenv import load_dotenv
import requests
import time

# Load environment variables
load_dotenv()

app = Flask(__name__)

# ✅ Use proper CORS configuration (localhost + configurable frontend origins)
allowed_origins = [o.strip() for o in os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,https://ai-banner-app.vercel.app"
).split(",") if o.strip()]
CORS(app, resources={r"/api/*": {"origins": allowed_origins}}, supports_credentials=True)


app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "supersecret")
app.config["UPLOAD_FOLDER"] = os.path.join(os.getcwd(), "static", "uploads")
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB max upload

jwt = JWTManager(app)
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# MongoDB
mongo_client = MongoClient(os.getenv("MONGO_URI"))
db = mongo_client["bannercraft"]
users_collection = db["users"]
history_collection = db["history"]
banners_collection = db["banners"]

# AI Horde (Stable Horde) setup
AI_HORDE_API_KEY = os.getenv("AI_HORDE_API_KEY", "0000000000")  # anonymous key allowed
AI_HORDE_API_BASE = os.getenv("AI_HORDE_API_BASE", "https://aihorde.net")
AI_HORDE_CLIENT_AGENT = "BannerCraft/1.0"

@app.errorhandler(NoAuthorizationError)
def handle_no_auth(err):
    return jsonify({"error": "Unauthorized. Please login again."}), 401

@app.before_request
def log_request():
    print(f"📥 {request.method} {request.path}")

def get_refined_prompt(theme, products, offer, colors):
    products_str = ", ".join([p.strip() for p in products])
    colors_str = ", ".join([c.strip() for c in colors])

    # Deterministic prompt builder tailored for photorealistic marketing banners
    positive_prompt_parts = [
        f"highly detailed professional marketing banner for {theme}",
        f"featuring {products_str}",
        f"clean layout, product-centric composition, realistic lighting, studio quality",
        f"bold typography for offer text: {offer}",
        f"cohesive color palette: {colors_str}",
        "sharp focus, vibrant, commercial photography, product showcase on textured surface",
        "symmetrical balance, subtle depth of field, soft shadows"
    ]
    negative_prompt = (
        "low quality, blurry, watermark, text artifacts, disfigured, deformed, extra limbs,"
        " lowres, jpeg artifacts, nsfw, cartoons, illustration, painting"
    )

    return ", ".join([p for p in positive_prompt_parts if p]) + f" ### negative: {negative_prompt}"

def generate_banner_image(prompt):
    headers = {
        "apikey": AI_HORDE_API_KEY,
        "Client-Agent": AI_HORDE_CLIENT_AGENT,
        "Content-Type": "application/json",
    }

    # Create async generation job
    payload = {
        "prompt": prompt,
        "params": {
            "sampler_name": "k_euler_a",
            "cfg_scale": 7,
            "denoising_strength": 0.72,
            "steps": 28,
            "width": 1024,
            "height": 1024,
            "karras": True,
            "hires_fix": True
        },
        "nsfw": False,
        "censor_nsfw": True,
        # Let the network choose suitable models; can be restricted if needed
        # "models": ["SDXL 1.0"],
    }

    create_resp = requests.post(
        f"{AI_HORDE_API_BASE}/api/v2/generate/async",
        headers=headers,
        json=payload,
        timeout=30
    )
    create_resp.raise_for_status()
    job = create_resp.json()
    job_id = job.get("id")
    if not job_id:
        raise RuntimeError("AI Horde did not return a job id")

    # Poll for completion
    max_wait_seconds = int(os.getenv("AI_HORDE_MAX_WAIT", "120"))
    start_time = time.time()
    while time.time() - start_time < max_wait_seconds:
        time.sleep(2)
        check_resp = requests.get(
            f"{AI_HORDE_API_BASE}/api/v2/generate/check/{job_id}",
            headers=headers,
            timeout=30
        )
        check_resp.raise_for_status()
        status = check_resp.json()
        if status.get("done"):
            generations = status.get("generations") or []
            if generations:
                img_b64 = generations[0].get("img")
                if img_b64:
                    return "data:image/png;base64," + img_b64
            break

    raise RuntimeError("Image generation timed out. Please try again.")

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    name = data.get("name")
    password = data.get("password")

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    user = {
        "name": name,
        "email": email,
        "password": hashed_pw,
        "username": "",
        "profileImage": "",
        "bio": "",
        "address": "",
        "phone": "",
        "location": "",
        "dob": "",
        "website": "",
        "linkedin": "",
        "github": "",
        "twitter": "",
        "skills": ""
    }
    result = users_collection.insert_one(user)
    token = create_access_token(identity=str(result.inserted_id))

    return jsonify({
        "token": token,
        "user": {
            "id": str(result.inserted_id),
            "name": name,
            "email": email
        }
    })

@app.route("/api/login", methods=["POST"]) 
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({"email": email})
    if not user or not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user["_id"]))
    fields = [
        "name", "email", "username", "profileImage", "bio", "address",
        "phone", "location", "dob", "website", "linkedin", "github", "twitter", "skills"
    ]

    return jsonify({
        "token": token,
        "user": {
            "id": str(user["_id"]),
            **{field: user.get(field, "") for field in fields}
        }
    })

@app.route("/api/me", methods=["GET"]) 
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404

    fields = [
        "name", "email", "username", "profileImage", "bio", "address",
        "phone", "location", "dob", "website", "linkedin", "github", "twitter", "skills"
    ]

    return jsonify({
        "id": str(user["_id"]),
        **{field: user.get(field, "") for field in fields}
    }), 200

@app.route("/api/update-profile", methods=["POST"]) 
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    try:
        data = request.get_json(force=True)
        allowed_fields = [
            "name", "email", "username", "bio", "address", "phone", "location",
            "website", "linkedin", "github", "twitter", "profileImage", "dob", "skills"
        ]
        updates = {field: data[field] for field in allowed_fields if field in data}

        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": updates}
        )

        if result.modified_count > 0:
            return jsonify({"success": True, "message": "Profile updated"}), 200
        else:
            return jsonify({"success": False, "message": "No changes made"}), 200
    except Exception as e:
        return jsonify({'error': 'Server-side exception occurred'}), 500

@app.route("/api/upload-profile-image", methods=["POST"]) 
@jwt_required()
def upload_profile_image():
    user_id = get_jwt_identity()
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        user_name = user.get('name', 'User') if user else 'User'
        random_param = str(uuid.uuid4())[:8]
        image_url = f"https://ui-avatars.com/api/?name={user_name.replace(' ', '+')}&size=200&background=374151&color=ffffff&bold=true&r={random_param}"

        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"profileImage": image_url}}
        )

        return jsonify({
            "success": True,
            "message": "Profile image updated successfully",
            "imageUrl": image_url
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"Error uploading image: {str(e)}"}), 500

@app.route("/api/generate", methods=["POST"]) 
@jwt_required()
def generate_banner():
    data = request.json
    user_id = get_jwt_identity()
    prompt = get_refined_prompt(data["theme"], data["products"], data["offer"], data["colors"]) 
    image_url = generate_banner_image(prompt)

    history_collection.insert_one({
        "user_id": ObjectId(user_id),
        "prompt": prompt,
        "image_url": image_url
    })

    banner = {
        "user_id": ObjectId(user_id),
        "name": f"{data['theme']} Banner",
        "image_url": image_url,
        "theme": data["theme"],
        "is_ai_generated": True,
        "created_at": datetime.datetime.now().isoformat(),
        "width": 1200,
        "height": 628,
        "elements": []
    }

    banners_collection.insert_one(banner)
    return jsonify({"prompt": prompt, "image_url": image_url})

@app.route("/api/history", methods=["GET"]) 
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    entries = history_collection.find({"user_id": ObjectId(user_id)}).sort("_id", -1)
    return jsonify([{"prompt": e["prompt"], "image_url": e["image_url"]} for e in entries])

@app.route("/api/banners", methods=["GET"]) 
@jwt_required()
def get_banners():
    user_id = get_jwt_identity()
    banners = banners_collection.find({"user_id": ObjectId(user_id)}).sort("created_at", -1)
    return jsonify({
        "banners": [{
            "id": str(b["_id"]),
            "name": b.get("name", ""),
            "imageUrl": b.get("image_url", ""),
            "theme": b.get("theme", ""),
            "isAiGenerated": b.get("is_ai_generated", False),
            "templateId": b.get("template_id"),
            "createdAt": b.get("created_at", "")
        } for b in banners]
    })

@app.route("/api/banners", methods=["POST"]) 
@jwt_required()
def save_banner():
    user_id = get_jwt_identity()
    data = request.json
    banner = {
        "user_id": ObjectId(user_id),
        "name": data.get("name", "Untitled Banner"),
        "image_url": data.get("imageUrl", ""),
        "theme": data.get("theme", ""),
        "is_ai_generated": data.get("isAiGenerated", False),
        "template_id": data.get("templateId"),
        "created_at": data.get("createdAt", ""),
        "width": data.get("width", 1200),
        "height": data.get("height", 628),
        "elements": data.get("elements", [])
    }
    result = banners_collection.insert_one(banner)
    return jsonify({
        "success": True,
        "banner": {
            "id": str(result.inserted_id),
            "name": banner["name"],
            "imageUrl": banner["image_url"],
            "theme": banner["theme"],
            "isAiGenerated": banner["is_ai_generated"],
            "templateId": banner["template_id"],
            "createdAt": banner["created_at"]
        }
    })

@app.route("/api/banners/<banner_id>", methods=["DELETE"]) 
@jwt_required()
def delete_banner(banner_id):
    user_id = get_jwt_identity()
    banner = banners_collection.find_one({"_id": ObjectId(banner_id), "user_id": ObjectId(user_id)})
    if not banner:
        return jsonify({"error": "Banner not found or access denied"}), 404
    banners_collection.delete_one({"_id": ObjectId(banner_id)})
    return jsonify({"success": True, "message": "Banner deleted successfully"})

@app.route("/api/banners/stats", methods=["GET"]) 
@jwt_required()
def get_banner_stats():
    user_id = get_jwt_identity()
    total = banners_collection.count_documents({"user_id": ObjectId(user_id)})
    ai = banners_collection.count_documents({"user_id": ObjectId(user_id), "is_ai_generated": True})
    templates = banners_collection.count_documents({"user_id": ObjectId(user_id), "template_id": {"$exists": True}})
    return jsonify({
        "totalBanners": total,
        "aiGenerations": ai,
        "templatesUsed": templates
    })

if __name__ == "__main__":
    app.run(debug=True)
