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
from openai import AzureOpenAI
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "supersecret")
app.config["UPLOAD_FOLDER"] = os.path.join(os.getcwd(), "static", "uploads")
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB max upload
jwt = JWTManager(app)

# Create upload directory if it doesn't exist
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# MongoDB setup
mongo_client = MongoClient(os.getenv("MONGO_URI"))
db = mongo_client["bannercraft"]
users_collection = db["users"]
history_collection = db["history"]
banners_collection = db["banners"]

# Azure OpenAI setup
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version=os.getenv("API_VERSION", "2024-04-01-preview"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)
CHAT_DEPLOYMENT = os.getenv("CHAT_DEPLOYMENT")
DALLE_DEPLOYMENT = os.getenv("DALLE_DEPLOYMENT")

@app.errorhandler(NoAuthorizationError)
def handle_no_auth(err):
    print("🚫 JWT Authorization Error:", str(err))
    return jsonify({"error": "Unauthorized. Please login again."}), 401

def get_refined_prompt(theme, products, offer, colors):
    products_str = ", ".join([p.strip() for p in products])
    colors_str = ", ".join([c.strip() for c in colors])

    user_prompt = f"""
I need to generate a promotional banner using DALL·E 3.

Details:
- Theme: {theme}
- Products: {products_str}
- Promotional Offer: {offer}
- Color Palette: {colors_str}
- Aspect Ratio: 1:7 (1360x800 px)

Please write a vivid, visually rich DALL·E 3 prompt that includes:
1. A festive or event-based layout matching the theme
2. Natural-looking product placement (e.g., in baskets, on wood platters)
3. Clear visual emphasis on the offer text
4. A color-matched background and mood
5. Marketing style, not artistic or abstract

Output only the generated prompt.
"""
    response = client.chat.completions.create(
        model=CHAT_DEPLOYMENT,
        messages=[
            {
                "role": "system",
                "content": "You are an expert creative director and marketing strategist. Your role is to craft highly detailed, visually imaginative, and commercially effective prompts for DALL·E 3 to generate promotional banners."
            },
            {"role": "user", "content": user_prompt}
        ]
    )
    return response.choices[0].message.content.strip()

def generate_banner_image(prompt):
    result = client.images.generate(
        model=DALLE_DEPLOYMENT,
        prompt=prompt,
        n=1,
        size="1024x1024",
        style="vivid",
        quality="standard"
    )
    return json.loads(result.model_dump_json())["data"][0]["url"]

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

@app.before_request
def log_request():
    print(f"📥 {request.method} {request.path}")

@app.route("/api/update-profile", methods=["POST"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    try:
        data = request.get_json(force=True)
        print("📩 Incoming profile data:", data)

        allowed_fields = [
            "name", "email", "username", "bio", "address", "phone", "location",
            "website", "linkedin", "github", "twitter", "profileImage", "dob", "skills"
        ]
        updates = {field: data[field] for field in allowed_fields if field in data}

        print("🛠 Updating fields:", updates)

        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": updates}
        )

        if result.modified_count > 0:
            return jsonify({"success": True, "message": "Profile updated"}), 200
        else:
            return jsonify({"success": False, "message": "No changes made"}), 200
    except Exception as e:
        print("❌ Exception in update_profile:", str(e))
        return jsonify({'error': 'Server-side exception occurred'}), 500

@app.route("/api/upload-profile-image", methods=["POST"])
@jwt_required()
def upload_profile_image():
    user_id = get_jwt_identity()
    
    try:
        if 'profileImage' not in request.files:
            return jsonify({"success": False, "message": "No file part"}), 400
            
        file = request.files['profileImage']
        
        if file.filename == '':
            return jsonify({"success": False, "message": "No selected file"}), 400
            
        # Check if the file is allowed
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
        if not '.' in file.filename or file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            return jsonify({"success": False, "message": "File type not allowed"}), 400
        
        # For a global solution, we'll use a direct image URL instead of storing locally
        # This is a placeholder - in a real app, you would upload to a cloud storage service
        # like AWS S3, Google Cloud Storage, or Azure Blob Storage
        
        # Get the user's name for the placeholder image
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        user_name = user.get('name', 'User') if user else 'User'
        
        # For demonstration purposes, we'll use a random avatar from UI Avatars
        # with a random parameter to prevent caching issues
        random_param = str(uuid.uuid4())[:8]
        image_url = f"https://ui-avatars.com/api/?name={user_name.replace(' ', '+')}&size=200&background=374151&color=ffffff&bold=true&r={random_param}"
        
        # Update the user's profile image in the database
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
        print("❌ Exception in upload_profile_image:", str(e))
        return jsonify({"success": False, "message": f"Error uploading image: {str(e)}"}), 500


@app.route("/api/generate", methods=["POST"])
@jwt_required()
def generate_banner():
    data = request.json
    user_id = get_jwt_identity()

    prompt = get_refined_prompt(
        data["theme"], data["products"], data["offer"], data["colors"]
    )
    image_url = generate_banner_image(prompt)

    # Save to history collection
    history_collection.insert_one({
        "user_id": ObjectId(user_id),
        "prompt": prompt,
        "image_url": image_url
    })
    
    # Also save to banners collection automatically
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
    return jsonify([
        {"prompt": entry["prompt"], "image_url": entry["image_url"]}
        for entry in entries
    ])

@app.route("/api/banners", methods=["GET"])
@jwt_required()
def get_banners():
    user_id = get_jwt_identity()
    banners = banners_collection.find({"user_id": ObjectId(user_id)}).sort("created_at", -1)
    
    return jsonify({
        "banners": [
            {
                "id": str(banner["_id"]),
                "name": banner.get("name", "Untitled Banner"),
                "imageUrl": banner.get("image_url", ""),
                "theme": banner.get("theme", ""),
                "isAiGenerated": banner.get("is_ai_generated", False),
                "templateId": banner.get("template_id"),
                "createdAt": banner.get("created_at", "")
            }
            for banner in banners
        ]
    })

@app.route("/api/banners", methods=["POST"])
@jwt_required()
def save_banner():
    user_id = get_jwt_identity()
    data = request.json
    
    # Create banner document
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
    
    # Verify the banner belongs to the user
    banner = banners_collection.find_one({
        "_id": ObjectId(banner_id),
        "user_id": ObjectId(user_id)
    })
    
    if not banner:
        return jsonify({"error": "Banner not found or access denied"}), 404
    
    # Delete the banner
    banners_collection.delete_one({"_id": ObjectId(banner_id)})
    
    return jsonify({"success": True, "message": "Banner deleted successfully"})

@app.route("/api/banners/stats", methods=["GET"])
@jwt_required()
def get_banner_stats():
    user_id = get_jwt_identity()
    
    # Count total banners
    total_banners = banners_collection.count_documents({"user_id": ObjectId(user_id)})
    
    # Count AI-generated banners
    ai_generations = banners_collection.count_documents({
        "user_id": ObjectId(user_id),
        "is_ai_generated": True
    })
    
    # Count template-based banners
    templates_used = banners_collection.count_documents({
        "user_id": ObjectId(user_id),
        "template_id": {"$exists": True, "$ne": None}
    })
    
    return jsonify({
        "totalBanners": total_banners,
        "aiGenerations": ai_generations,
        "templatesUsed": templates_used
    })

if __name__ == "__main__":
    app.run(debug=True)

CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:3000"
]}}, supports_credentials=True)

