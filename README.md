# 🚀 Hirix – AI Interview Simulation & Career Prep Platform

Hirix is a full-stack AI-powered platform designed to empower candidates in their job search. It simulates **job interviews (HR & Technical)**, generates **tailored CVs (LaTeX)**, and provides **AI-driven profile critiques** to help users land their dream jobs.

The project was developed collaboratively by a team of three developers.

---

## 🎯 Project Highlights

**AI Interview Engine**: Realistic HR & Technical simulations via n8n/LLM integration.
**Dynamic CV Generation**: Automated creation of LaTeX-based resumes tailored to specific job offers.
**Intelligent Feedback**: Automated response evaluation with structured performance insights.
**Job Tracker**: Full lifecycle management for job applications and to-do lists.
**Secure Architecture**: JWT-based auth (Access + Refresh tokens) with HttpOnly cookies.
**Premium UI**: Modern Glassmorphism design with responsive dark mode.

---

## ✨ Key Features

### 🧑‍💼 Interview Simulation
* **HR Module**: Behavioral interview simulation with dynamic question flows.
* **Technical Module**: Specialized technical question generation based on user domain.
* **Real-time Interaction**: Question → Response → Next Step logic powered by AI.

### 📄 Career Tools & AI Analysis
* **CV Architect**: Generates professional LaTeX code for resumes based on user profile and job descriptions.
* **Profile Critique**: AI-powered analysis of user profiles to identify strengths and areas for improvement.
* **Application Tracker**: Manage job applications, statuses, and associated CV versions.

### 🔐 Authentication & Security
* **JWT Ecosystem**: Secure authentication with automatic token refreshing.
* **HttpOnly Cookies**: Protection against XSS by storing refresh tokens securely.
* **Rate Limiting**: Brute-force protection for login and registration endpoints.
* **Token Blacklist**: System to invalidate tokens upon logout or security breach.

### 🎨 UI/UX
* **Modern Interface**: Sleek dark theme with animated gradients.
* **Interactive Dashboard**: Overview of recent applications, interviews, and tasks.
* **Responsive Design**: Seamless experience across mobile, tablet, and desktop.

---

## 🧠 My Contributions (Aram FILALI)

As a core contributor, I focused on the **AI orchestration, interview logic, and backend architecture**:

### AI Orchestration & Logic
* Designed and implemented the **HR and Technical interview simulation modules**.
* Built the **AI Evaluation System** to provide structured feedback on candidate performance.
* Integrated **n8n workflows** to handle complex LLM interactions for simulations and CV generation.

### Backend Architecture
* Developed the **RESTful API** using Node.js and Express.
* Implemented the **Secure Auth System** (JWT Access/Refresh, Cookie management).
* Designed the **storage abstraction** (supporting both MongoDB and local JSON fallback).

### Full-Stack Integration
* Bridged the React frontend with the AI-driven backend services.
* Managed **dynamic state flows** for multi-step interview simulations.
* Implemented **CV management logic**, linking generated resumes to job applications.

---

## 🛠️ Tech Stack

### Backend
* **Runtime**: Node.js, Express
* **Database**: MongoDB (Mongoose ODM) / Local JSON Fallback
* **AI Integration**: n8n Webhooks, LLM (via n8n)
* **Security**: JWT, bcrypt, cookie-parser, express-rate-limit

### Frontend
* **Framework**: React 19, Vite
* **Routing**: React Router 7
* **API Client**: Axios
* **Styling**: Modern CSS (Glassmorphism, Animations)

---

## 📁 Project Structure

```
Hirix/
├── client/             # React frontend (Vite)
│   ├── src/
│   │   ├── api/       # Axios interceptors & services
│   │   ├── components/# Reusable UI elements
│   │   └── pages/     # Dashboard, Interview, CV Builder...
└── server/             # Node.js backend
    ├── controllers/   # Business logic (Auth, Interview, CV...)
    ├── models/        # Mongoose schemas
    ├── routes/        # API endpoint definitions
    └── utils/         # Auth helpers & storage fallback
```

---

## ⚙️ Setup Instructions

### 1. Backend
```bash
cd server
npm install
# Configure .env (see below)
npm run dev
```

### 2. Frontend
```bash
cd client
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Server (`server/.env`)
```env
MONGO_URI=              # Optional (defaults to JSON storage if empty)
PORT=5000
NODE_ENV=development
JWT_ACCESS_SECRET=      # Long random string
JWT_REFRESH_SECRET=     # Long random string
CLIENT_URL=http://localhost:5173
```

---

## 🚀 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Secure user authentication |
| `POST` | `/api/hr-interview` | Start/Continue HR AI simulation |
| `POST` | `/api/technical-interview` | Generate technical questions |
| `POST` | `/api/profile-critique` | AI profile analysis |
| `POST` | `/api/cvs/generate` | Generate tailored LaTeX CV |
| `GET` | `/api/job-applications` | Fetch user job applications |

---

## 🧪 Security Features

* **Password Hashing**: bcrypt with salted rounds.
* **JWT Auth**: Access & Refresh tokens for secure sessions.
* **Secure Cookies**: Refresh tokens stored in HttpOnly cookies.
* **Rate Limiting**: Anti brute-force middleware on auth routes.
* **CORS Protection**: Restricted to authorized frontend origins.


---

## 📄 License

This project is developed for educational purposes and portfolio demonstration.
