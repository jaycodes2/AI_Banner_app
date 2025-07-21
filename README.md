# 🎨 BannerCraft

<div align="center">

![BannerCraft Logo](https://img.shields.io/badge/BannerCraft-AI%20Banner%20Generator-blue?style=for-the-badge)

**Create stunning marketing banners powered by AI in seconds**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-Python-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Azure OpenAI](https://img.shields.io/badge/Azure-OpenAI-0078D4?style=flat-square&logo=microsoft-azure)](https://azure.microsoft.com/en-us/services/cognitive-services/openai-service/)
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
      <td align="center">
        <img src="https://img.shields.io/badge/-%F0%9F%93%8A%20Analytics-blue" alt="Analytics"/><br />
        <b>Banner Statistics</b><br />
        Track usage and<br />generation metrics
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/-%F0%9F%91%A4%20Profiles-orange" alt="Profiles"/><br />
        <b>Profile Management</b><br />
        Customize user profiles<br />and avatars
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/-%F0%9F%93%9A%20History-yellow" alt="History"/><br />
        <b>Banner History</b><br />
        View and manage<br />previous generations
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
- Azure OpenAI API access

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
AZURE_OPENAI_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
API_VERSION=2024-04-01-preview
CHAT_DEPLOYMENT=your_chat_model_deployment_name
DALLE_DEPLOYMENT=your_dalle_model_deployment_name
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

## 🏗️ Architecture

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=BannerCraft+Architecture" alt="Architecture Diagram" width="800"/>
</div>

### Tech Stack Overview

#### 🔹 Backend
- **Framework**: Flask (Python)
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Azure OpenAI API (DALL-E 3)
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
      <td><img src="https://via.placeholder.com/400x225?text=Banner+Generator" alt="Banner Generator"/></td>
    </tr>
    <tr>
      <td><img src="https://via.placeholder.com/400x225?text=User+Dashboard" alt="User Dashboard"/></td>
      <td><img src="https://via.placeholder.com/400x225?text=Banner+History" alt="Banner History"/></td>
    </tr>
  </table>
</div>

## 🚀 Deployment

### Backend Deployment

The Flask backend can be deployed to:
- **Heroku**: Easy deployment with Procfile
- **Azure App Service**: Seamless integration with Azure OpenAI
- **AWS Elastic Beanstalk**: Scalable deployment option

### Frontend Deployment

The React frontend is configured for deployment on:
- **Vercel**: Zero-configuration deployment (recommended)
- **Netlify**: Simple deployment from Git
- **GitHub Pages**: Free hosting option

## 🛠️ Development

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Code Linting

```bash
# Backend linting
cd backend
flake8

# Frontend linting
cd frontend
npm run lint
```

## 📄 License

[MIT License](LICENSE)

## 👥 Contributors

- Your Name - Lead Developer

---

<div align="center">
  <p>Made with ❤️ by the BannerCraft Team</p>
  <p>
    <a href="https://github.com/yourusername/bannercraft">GitHub</a> •
    <a href="https://bannercraft-demo.vercel.app">Live Demo</a>
  </p>
</div>
