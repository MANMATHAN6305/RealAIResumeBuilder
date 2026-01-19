# Project Structure - AI Resume Builder

## 📁 Complete Directory Structure

```
Ai_Resume_Builder/
│
├── 📂 backend/                    # Backend Server (Express + MySQL)
│   ├── index.js                   # Main server file
│   ├── package.json               # Backend dependencies
│   ├── package-lock.json          # Lock file
│   ├── .env                       # Environment variables (CREATE THIS)
│   └── node_modules/              # Backend dependencies
│
├── 📂 frontend/                   # Frontend Application (React + TypeScript)
│   ├── 📂 src/                    # Source code
│   │   ├── 📂 components/         # React components
│   │   │   ├── Login.tsx
│   │   │   ├── ResumeForm.tsx
│   │   │   ├── ResumePreview.tsx
│   │   │   ├── AISuggestions.tsx
│   │   │   └── SignUp.tsx
│   │   ├── 📂 utils/              # Utility functions
│   │   │   ├── api.ts             # API client
│   │   │   ├── auth.ts            # Authentication
│   │   │   ├── resumeStorage.ts  # Resume storage
│   │   │   ├── exportResume.ts   # PDF/Text export
│   │   │   └── aiSuggestions.ts  # AI suggestions
│   │   ├── 📂 lib/                # Libraries
│   │   │   └── supabase.ts        # (Legacy, not used)
│   │   ├── 📂 types/               # TypeScript types
│   │   │   └── resume.ts
│   │   ├── App.tsx                # Main component
│   │   ├── main.tsx               # Entry point
│   │   ├── index.css              # Global styles
│   │   └── vite-env.d.ts         # Vite types
│   ├── index.html                 # HTML entry
│   ├── package.json               # Frontend dependencies
│   ├── package-lock.json          # Lock file
│   ├── vite.config.ts             # Vite config
│   ├── tailwind.config.js         # Tailwind config
│   ├── postcss.config.js          # PostCSS config
│   ├── eslint.config.js           # ESLint config
│   ├── tsconfig.json              # TypeScript config
│   ├── tsconfig.app.json         # App TS config
│   ├── tsconfig.node.json         # Node TS config
│   ├── .env                       # Environment variables (CREATE THIS)
│   ├── dist/                      # Build output
│   └── node_modules/              # Frontend dependencies
│
├── 📄 mysql-schema.sql            # Database schema
├── 📄 package.json                # Root package.json (convenience scripts)
│
├── 📚 Documentation/
│   ├── README.md                  # Main documentation
│   ├── COMMANDS.md                # Command reference
│   ├── MYSQL_SETUP.md             # MySQL setup guide
│   ├── PROJECT_STRUCTURE.md        # Detailed structure
│   └── STRUCTURE.md               # This file
│
└── 🔧 Other Files/
    ├── test-login.ps1             # Test script
    └── Various .md files           # Additional docs
```

## 🎯 Key Directories

### Backend (`/backend`)
- **Purpose**: Express.js REST API server
- **Technology**: Node.js, Express, MySQL
- **Port**: 3001
- **Main File**: `index.js`

### Frontend (`/frontend`)
- **Purpose**: React application
- **Technology**: React, TypeScript, Vite, Tailwind CSS
- **Port**: 5173 (default)
- **Entry Point**: `src/main.tsx`

## 📝 Environment Files

### Backend `.env` (create in `/backend/.env`)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=resume_builder
PORT=3001
JWT_SECRET=your-random-secret-key
```

### Frontend `.env` (create in `/frontend/.env`)
```env
VITE_API_URL=http://localhost:3001/api
```

## 🚀 Quick Commands

### Backend
```powershell
cd backend
npm install      # First time
npm start        # Production
npm run dev      # Development
```

### Frontend
```powershell
cd frontend
npm install      # First time
npm run dev      # Development
npm run build    # Production build
```

## 📦 Dependencies

### Backend Dependencies
- express
- mysql2
- cors
- bcryptjs
- jsonwebtoken
- dotenv

### Frontend Dependencies
- react
- react-dom
- vite
- typescript
- tailwindcss
- lucide-react
- jspdf
- html2canvas

## 🔄 Data Flow

```
Frontend (React) 
    ↓ HTTP Requests
Backend API (Express)
    ↓ SQL Queries
MySQL Database
```

## 📍 Important Paths

- **Backend API**: `http://localhost:3001/api`
- **Frontend App**: `http://localhost:5173`
- **Database Schema**: `mysql-schema.sql` (root)
- **Backend Config**: `backend/.env`
- **Frontend Config**: `frontend/.env`
