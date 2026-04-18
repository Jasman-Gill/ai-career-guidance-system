# AI Career Guidance System

AI Career Guidance System is a full-stack web app that analyzes a user's resume, identifies skill gaps, and suggests career paths with a learning roadmap using Gemini.

## Overview

This project includes:
- A React + Vite frontend (`client`) for authentication, resume upload, and results visualization
- A Node.js + Express backend (`server`) for auth, file handling, PDF parsing, and AI analysis
- MongoDB for user and resume persistence
- Gemini API integration for resume intelligence and recommendations

## Core Features

- User authentication (register, login, Google login)
- Resume upload and PDF text extraction
- AI-powered analysis of resume + user-entered skills/interests
- Suggested career paths and missing skill insights
- Analysis result dashboard with charts
- User profile update endpoint

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router, Recharts, Firebase Auth
- Backend: Node.js, Express, Mongoose, Multer, pdf-parse, JWT, bcryptjs
- AI: Google Gemini API (`generateContent`)
- Database: MongoDB

## Project Structure

```text
ai-career-guidance-system/
├─ client/                      # React frontend
│  ├─ src/
│  │  ├─ pages/                 # App pages (Dashboard, Analysis, Auth)
│  │  ├─ services/api.js        # Axios API client
│  │  └─ firebase.js            # Firebase auth setup
│  └─ components/layout/        # Shared UI components incl. UploadForm
├─ server/                      # Express backend
│  ├─ controllers/              # Route handlers
│  ├─ routes/                   # API routes
│  ├─ models/                   # Mongoose models
│  ├─ utils/                    # AI service, parser, upload middleware
│  └─ config/db.js              # Mongo connection
└─ README.md
```

## Local Setup

### 1. Prerequisites

- Node.js 18+
- npm 9+
- MongoDB connection string
- Gemini API key

### 2. Install Dependencies

From the repository root:

```bash
cd client && npm install
cd ../server && npm install
```

### 3. Configure Environment Variables

Create `server/.env`:

```env
PORT=5002
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
# Optional model override:
# GEMINI_MODEL=gemini-2.0-flash
```

Why `PORT=5002`?
- The frontend API client is currently hardcoded to `http://localhost:5002/api` in `client/src/services/api.js`.

### 4. Run the App

Use two terminals:

Terminal 1 (backend)

```bash
cd server
npm run dev
```

Terminal 2 (frontend)

```bash
cd client
npm run dev
```

Open the frontend URL shown by Vite (typically `http://localhost:5173`).

## API Summary

Base URL: `http://localhost:5002/api`

Auth routes:
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/google`
- `PUT /auth/profile`

Resume routes:
- `POST /resume/upload` (multipart form, field name: `resume`)

Analysis routes:
- `POST /analysis/analyze`

## AI Response Shape

The analysis service prompts Gemini to return JSON in this shape:

```json
{
	"skills": [],
	"careers": [],
	"missingSkills": [],
	"roadmap": ""
}
```

## Available Scripts

Frontend (`client/package.json`):
- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview build
- `npm run lint` - run ESLint

Backend (`server/package.json`):
- `npm run dev` - start API with nodemon

## Troubleshooting

- `AI Analysis Failed: ... not configured`
	- Ensure `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) exists in `server/.env`.

- Network errors from frontend to backend
	- Confirm backend is running and listening on `PORT=5002`.

- `Resume not found` during analysis
	- Upload a resume first via `/resume/upload` for the current user.

- MongoDB connection fails
	- Verify `MONGO_URI` and network access to your MongoDB instance.

## Notes

- Firebase config currently exists in `client/src/firebase.js` as inline values.
- For production, move frontend keys to Vite environment variables and avoid committing sensitive config.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
