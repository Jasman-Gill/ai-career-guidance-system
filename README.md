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

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5002/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

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

## Deploy To Vercel

This repository is configured to deploy the React app and Express API as one Vercel project. The API is served from `/api`, and uploaded PDFs are parsed in memory before their extracted text is saved to MongoDB.

1. Push the latest repository changes to GitHub, including `vercel.json`, `api/index.js`, and `server/app.js`.
2. In Vercel, select **Add New > Project**, import the GitHub repository, and keep the **Root Directory** set to the repository root.
3. Vercel reads `vercel.json`, so leave the build and output directory overrides disabled in the dashboard.
4. Before deploying, add these environment variables under **Settings > Environment Variables**. Select **Production**, **Preview**, and **Development** when appropriate.

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=a_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
HF_API_KEY=your_hugging_face_token
VITE_API_BASE_URL=/api
```

5. Add the `VITE_FIREBASE_*` variables only if Google login is enabled. Firebase client configuration is visible in the browser by design, but restrict the Firebase API key to your deployed domain in Firebase or Google Cloud.
6. Deploy the project. Once Vercel gives you a domain, optionally add `CLIENT_ORIGIN=https://your-project.vercel.app` and redeploy to restrict browser access to that origin.
7. In MongoDB Atlas, add a database user and allow Vercel to reach the cluster. Vercel uses dynamic outbound IP addresses, so Atlas deployments commonly require `0.0.0.0/0` in Network Access; use a strong database password and least-privilege user.

The Vercel Function accepts PDF uploads up to 4 MB. This stays below Vercel's 4.5 MB function request limit.

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
