# 🎨 BannerCraft

<div align="center">

![BannerCraft Logo](https://img.shields.io/badge/BannerCraft-AI%20Banner%20Generator-blue?style=for-the-badge)

**Create stunning marketing banners powered by AI in seconds**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-Python-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=flat-square&logo=openai)](https://platform.openai.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

</div>

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/-%F0%9F%A4%96%20AI%20Generation-blueviolet" alt="AI Generation"/><br />
        <b>AI-Powered Banners</b><br />
        Create professional marketing<br />banners with DALL-E 3
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/-%F0%9F%94%92%20Secure-success" alt="Secure"/><br />
        <b>User Authentication</b><br />
        JWT-based secure<br />authentication system
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/-%F0%9F%91%A4%20Profiles-orange" alt="Profiles"/><br />
        <b>Profile Management</b><br />
        Customize user profiles<br />and avatars
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/-%F0%9F%8E%A8%20Templates-red" alt="Templates"/><br />
        <b>Banner Templates</b><br />
        Use and customize<br />pre-made templates
      </td>
    </tr>
  </table>
</div>

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB
- OpenAI API access (or compatible provider)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/bannercraft.git
cd bannercraft

# Setup backend
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (see example below)
# Start the server
python app.py
```

#### Backend `.env` Example

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bannercraft
JWT_SECRET_KEY=your_secure_jwt_secret_key
OPENAI_API_KEY=sk-...
OPENAI_CHAT_MODEL=gpt-4o-mini
OPENAI_IMAGE_MODEL=gpt-image-1
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file
# Start development server
npm run dev
```

#### Frontend `.env` Example

```
VITE_API_URL=http://localhost:5000/api
```

> Note: This project previously used Azure OpenAI. It now uses the standard OpenAI API with `OPENAI_API_KEY`, `OPENAI_CHAT_MODEL`, and `OPENAI_IMAGE_MODEL`.

## 🏗️ Architecture

<div align="center">

```mermaid
graph TD
    subgraph "Frontend - React"
        UI[User Interface] --> ReactApp[React Application]
        ReactApp --> Router[React Router]
        ReactApp --> ApiService[API Service Layer]
        ReactApp --> State[State Management]
    end

    subgraph "Backend - Flask"
        API[Flask API] --> Auth[JWT Authentication]
        API --> Controllers[API Controllers]
        Controllers --> BannerService[Banner Service]
        Controllers --> UserService[User Service]
        BannerService --> AIService[AI Integration Service]
    end

    subgraph "External Services"
        AIService --> OpenAI[OpenAI Chat + Images]
    end

    subgraph "Database"
        MongoDB[(MongoDB)] --> Collections[Collections]
        Collections --> Users[Users Collection]
        Collections --> Banners[Banners Collection]
        Collections --> History[History Collection]
    end

    ApiService --> API
    UserService --> MongoDB
    BannerService --> MongoDB
```

*BannerCraft System Architecture*
</div>

### Tech Stack Overview

#### 🔹 Backend
- **Framework**: Flask (Python)
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: OpenAI API (Images + Chat)
- **Key Libraries**: flask-cors, bcrypt, python-dotenv

#### 🔸 Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v7
- **UI Components**: Framer Motion, Lucide React
- **HTTP Client**: Axios

## 📁 Project Structure

```
bannercraft/
├── 🔹 backend/
│   ├── app.py               # Main Flask application
│   ├── requirements.txt     # Python dependencies
│   ├── static/              # Static files and uploads
│   └── templates/           # HTML templates
│
└── 🔸 frontend/
    ├── public/              # Public assets
    ├── src/                 # Source code
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── services/        # API services
    │   └── App.jsx          # Main application component
    ├── index.html           # HTML entry point
    ├── package.json         # NPM dependencies
    └── vite.config.js       # Vite configuration
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/signup` | Register a new user |
| `POST` | `/api/login` | Authenticate a user |
| `GET`  | `/api/me` | Get current user profile |

### Profile Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/update-profile` | Update user profile |
| `POST` | `/api/upload-profile-image` | Upload profile image |

### Banner Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/generate` | Generate a new banner using AI |
| `GET`  | `/api/history` | Get generation history |
| `GET`  | `/api/banners` | Get all user banners |
| `POST` | `/api/banners` | Save a new banner |
| `DELETE` | `/api/banners/<banner_id>` | Delete a banner |
| `GET`  | `/api/banners/stats` | Get banner statistics |

## 🖼️ Screenshots

<div align="center">
  <table>
    <tr>
      <td><img src="https://github.com/jaycodes2/AI_Banner_app/blob/main/Screenshot%202025-07-21%20193314.png"/></td>
    </tr>
    <tr>
      <td><img src="https://github.com/jaycodes2/AI_Banner_app/blob/affe5c1d5809cc5fbc68abc5cdd9bea1c86f415a/Screenshot%202025-07-21%20193921.png"/></td>
    </tr>
    <tr>
      <td><img src="https://github.com/jaycodes2/AI_Banner_app/blob/10a083021a3bce157525819e3a13f78922dced01/Screenshot%202025-07-21%20193745.png"/></td>
    </tr>
  </table>
</div>

## 👥 Contributors

- Jayanthan P - Lead Developer

---
