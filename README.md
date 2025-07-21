Got it. Here's the **entire `README.md`** in a single raw text block — no formatting breaks, no explanations — ready for you to copy-paste directly:

---

````
# 🧠 AI Banner App

**Design stunning AI-generated banners in seconds.**  
Built with MERN stack, OpenAI integration & a modern UX.

<p align="center">
  <a href="https://ai-banner-app.vercel.app" target="_blank">🌐 Live Demo</a> ·
  <a href="https://github.com/jaycodes2/AI_Banner_app/issues" target="_blank">Report Bug</a> ·
  <a href="https://github.com/jaycodes2/AI_Banner_app" target="_blank">Star This Repo ⭐</a>
</p>

---

## 🚀 Overview

The **AI Banner App** lets users create visually stunning banners powered by AI prompts.  
Simply sign in, enter your creative ideas, and let the app generate polished banners using OpenAI.

**Key Features**  
- 🔐 JWT Auth with protected routes  
- 🎨 Prompt-based banner generation  
- 📂 Save and manage your creations  
- 💡 Sleek, modern UI with dark mode  
- ☁️ Hosted on Vercel (frontend) & Render (backend)

---

## 🌍 Live URLs

| Frontend | Backend |
|----------|---------|
| [ai-banner-app.vercel.app](https://ai-banner-app.vercel.app) | [ai-banner-app.onrender.com](https://ai-banner-app.onrender.com) |

---

## 📸 Preview

> _[Add screenshot or GIF of the app here if available]_

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion, Lucide Icons  
- **Backend**: Node.js, Express.js, MongoDB, JWT  
- **AI Integration**: OpenAI API  
- **Hosting**: Vercel (Frontend), Render (Backend)

---

## ⚙️ Getting Started (Local Development)

### Prerequisites

- Node.js & npm  
- MongoDB (Atlas or Local)  
- OpenAI API Key

### 1. Clone the Repository

```bash
git clone https://github.com/jaycodes2/AI_Banner_app.git
cd AI_Banner_app
````

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
CLIENT_URL=http://localhost:5173
```

Run backend server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside `client/`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

---

## ✨ Features in Detail

* 🧠 **AI Banner Generation** — Enter a prompt and generate a design
* 📋 **Auth** — Login & Signup using JWT (protected routes)
* 🎛️ **User Dashboard** — Access history and profile
* 🌗 **Dark Mode** — Toggle & auto-detect system theme
* ⚡ **Smooth Animations** — Powered by Framer Motion

---

## 🗂️ Folder Structure

```
AI_Banner_app/
├── client/         # React frontend
│   ├── components/
│   ├── context/
│   └── ...
├── server/         # Express backend
│   ├── routes/
│   ├── controllers/
│   └── ...
```

---

## 👨‍💻 Author

**Jayanthan P**
GitHub: [@jaycodes2](https://github.com/jaycodes2)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE)

---

## 🤝 Contributing

Pull requests are welcome! If you find bugs or want to suggest features:
👉 [Open an issue](https://github.com/jaycodes2/AI_Banner_app/issues)

---

> ⭐ If you found this useful, give it a star and share it!

```

---

Done. Paste this straight into your `README.md`. Let me know if you want it enhanced with badges, preview GIFs, or a custom banner.
```
