# AI-Powered Career Intelligence Platform

An AI-powered Career Intelligence Platform designed to help users analyze their resumes, identify skill gaps, receive personalized career guidance, track job and internship opportunities, and build structured learning paths.

---

## 🚀 Features

### Resume & ATS Analysis
- Resume parsing and analysis
- ATS score calculation
- Job Description matching
- Resume improvement suggestions
- Skill extraction and evaluation

### Career Intelligence
- Career prediction
- Personalized career recommendations
- Skill Gap Analysis
- Career analytics and insights

### Personalized Learning Path
- Structured 4-phase learning roadmap
- Phase-wise skills to master
- Recommended learning resources
- Estimated duration for each phase
- Expected outcome for every learning phase

### Job Recommendations
- Job discovery and recommendations
- Job search and filtering
- Job tracking functionality

### Internship Module
- Internship discovery
- Search and filters
- Paid and unpaid internship filtering
- Remote, hybrid and on-site filtering
- View internship details
- Save internships
- Apply Now functionality
- Application status tracking
- Personal notes
- My Applications dashboard

### Resume Tools
- Resume Builder
- Resume Parser
- Resume Analyzer
- Resume Improvement Suggestions

### User & Platform Features
- User authentication
- JWT-based authorization
- User profile management
- Notifications
- Feedback system
- Activity tracking
- Admin dashboard

---

## 🛠️ Technology Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT (JSON Web Tokens)

---

## 📂 Project Structure

```text
career-intelligence-platform/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md

```

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/AnanyaRajput16/AI-powered-Career-Intelligence-Platform.git


```

### 2. Backend Setup

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder and add your environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start the backend server:

```bash
npm start
```

### 3. Frontend Setup

Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The application will then be available on the local Vite development server.

---

## 🔐 Security

Sensitive files such as environment variables and dependencies are excluded from GitHub using `.gitignore`.

The following files and folders are not uploaded:

```text
.env
node_modules/
build/
dist/
```

---

## 📊 Main Modules

1. Dashboard
2. ATS Analyzer
3. Resume Analyzer
4. Resume Builder
5. Resume Parser
6. Resume Improvements
7. Skill Gap Analyzer
8. Career Prediction
9. Career Recommendations
10. Learning Path
11. Course Recommendations
12. Job Recommendations
13. Internship Module
14. Dashboard Analytics
15. User Profile
16. Notifications
17. Feedback System
18. Admin Dashboard

---

## 🎯 Project Objective

The objective of this project is to create a centralized career intelligence platform that helps students and job seekers make informed career decisions by combining resume analysis, ATS evaluation, skill gap identification, personalized learning paths, career recommendations, and job and internship tracking.

---

## 👩‍💻 Author

**Ananya Rajput**

---

## 📌 Project Status

The project is actively developed and currently includes core Career Intelligence, Resume Analysis, Learning Path, Job Recommendations, Internship Tracking, Authentication, Analytics, and Admin functionalities.