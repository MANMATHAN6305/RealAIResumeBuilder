# Project Structure Documentation

This document provides a detailed overview of the AI Resume Builder project structure.

## Root Directory

```
Ai_Resume_Builder/
├── server/              # Backend Express API server
├── src/                 # Frontend React application
├── mysql-schema.sql     # MySQL database schema
├── MYSQL_SETUP.md       # MySQL setup guide
├── README.md            # Main project documentation
└── Configuration files  # package.json, vite.config.ts, etc.
```

## Backend (`/server`)

Express.js REST API server with MySQL database connection.

### Files:
- **index.js** - Main server file containing:
  - Express app setup
  - MySQL connection pool
  - Authentication routes (register, login)
  - Resume CRUD routes (GET, POST, DELETE)
  - JWT middleware for protected routes
  - CORS configuration

- **package.json** - Backend dependencies:
  - express - Web framework
  - mysql2 - MySQL driver
  - cors - CORS middleware
  - bcryptjs - Password hashing
  - jsonwebtoken - JWT authentication
  - dotenv - Environment variables

- **.env** (create this) - Backend environment variables:
  ```
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=your_password
  DB_NAME=resume_builder
  PORT=3001
  JWT_SECRET=your-secret-key
  ```

## Frontend (`/src`)

React + TypeScript application with Vite build tool.

### Components (`/src/components`)

- **Login.tsx** - User authentication (sign up/sign in)
- **ResumeForm.tsx** - Form for editing resume data
- **ResumePreview.tsx** - A4-sized resume preview
- **AISuggestions.tsx** - AI-powered resume suggestions

### Utilities (`/src/utils`)

- **api.ts** - API client for communicating with Express backend
  - Handles JWT token management
  - Centralized fetch wrapper
  - Error handling

- **auth.ts** - Authentication functions
  - signIn() - Login user
  - signUp() - Register user
  - signOut() - Logout user
  - getCurrentUser() - Get current user from token

- **resumeStorage.ts** - Resume data persistence
  - saveResumeForUser() - Save resume to MySQL
  - loadResumeForUser() - Load resume from MySQL
  - deleteResumeForUser() - Delete resume

- **exportResume.ts** - Export functionality
  - exportToPDF() - Generate A4 PDF
  - exportToText() - Generate text file
  - downloadTextFile() - Download helper

- **aiSuggestions.ts** - AI suggestions utilities

### Types (`/src/types`)

- **resume.ts** - TypeScript interfaces:
  - Resume
  - PersonalInfo
  - WorkExperience
  - Education
  - Skills
  - Certification
  - Project

### Main Files

- **App.tsx** - Main application component
  - State management
  - Routing logic
  - Auto-save functionality
  - Export handlers

- **main.tsx** - React entry point

- **index.css** - Global styles and Tailwind imports

## Database Schema (`mysql-schema.sql`)

MySQL database schema with three tables:

1. **users** - User accounts
   - id (INT, PRIMARY KEY)
   - email (VARCHAR, UNIQUE)
   - password (VARCHAR, hashed)
   - created_at, updated_at

2. **resumes** - Resume data
   - id (INT, PRIMARY KEY)
   - user_id (INT, FOREIGN KEY to users)
   - title, template_style, target_role
   - personal_info (JSON)
   - professional_summary (TEXT)
   - work_experience, education, skills, certifications, projects (JSON)
   - created_at, updated_at

3. **ai_suggestions** - AI suggestions (future use)
   - id (INT, PRIMARY KEY)
   - resume_id (INT, FOREIGN KEY to resumes)
   - section, original_text, suggested_text, reason
   - applied (BOOLEAN)
   - created_at

## Configuration Files

### Root Level

- **package.json** - Frontend dependencies and scripts
- **vite.config.ts** - Vite build configuration
- **tailwind.config.js** - Tailwind CSS configuration
- **tsconfig.json** - TypeScript configuration
- **.env** (create this) - Frontend environment:
  ```
  VITE_API_URL=http://localhost:3001/api
  ```

### Backend (`/server`)

- **package.json** - Backend dependencies
- **.env** (create this) - Backend environment variables

## Setup Order

1. **Database**: Run `mysql-schema.sql` to create database and tables
2. **Backend**: 
   - Create `server/.env` with database credentials
   - Run `npm install` in `server/` directory
   - Start with `npm start` or `npm run dev`
3. **Frontend**:
   - Create `.env` in root with API URL
   - Run `npm install` in root directory
   - Start with `npm run dev`

## API Endpoints

All endpoints are prefixed with `/api`:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/resume` - Get user's resume (requires auth)
- `POST /api/resume` - Save/update resume (requires auth)
- `DELETE /api/resume` - Delete resume (requires auth)
- `GET /api/health` - Health check

## Data Flow

1. User logs in → Frontend calls `/api/auth/login` → Backend validates → Returns JWT token
2. Token stored in localStorage → Included in Authorization header for API calls
3. User edits resume → Auto-save triggers → Frontend calls `/api/resume` POST → Backend saves to MySQL
4. User logs in again → Frontend calls `/api/resume` GET → Backend loads from MySQL → Returns resume data

## Notes

- The `src/lib/supabase.ts` file is kept for backward compatibility but is not actively used
- All database operations go through the Express API
- JWT tokens expire after 7 days
- Passwords are hashed using bcrypt with 10 rounds
- Auto-save triggers 2 seconds after last change

