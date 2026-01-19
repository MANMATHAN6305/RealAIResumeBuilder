# AI Resume Builder

A modern, AI-powered resume builder application with MySQL backend.

## Features

- ✅ User authentication (Sign up / Sign in)
- ✅ Resume builder with multiple templates (Professional, Modern, Minimal)
- ✅ Auto-save functionality
- ✅ A4 PDF export with proper formatting
- ✅ Text export
- ✅ MySQL backend for data persistence
- ✅ Responsive design

## Quick Start

### Prerequisites

- Node.js 18+ installed
- MySQL Server installed and running
- npm or yarn package manager

### 1. Set Up Database

1. Start MySQL server
2. Run the database schema:
   ```bash
   mysql -u root -p < mysql-schema.sql
   ```
   Or import `mysql-schema.sql` using MySQL Workbench/phpMyAdmin

### 2. Set Up Backend Server

1. Navigate to backend directory:
   ```powershell
   cd backend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Create `.env` file:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=resume_builder
   PORT=3001
   JWT_SECRET=your-random-secret-key
   ```

4. Start backend server:
   ```powershell
   npm start
   ```
   Or for development:
   ```powershell
   npm run dev
   ```

### 3. Set Up Frontend

1. Navigate to frontend directory:
   ```powershell
   cd frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

4. Start development server:
   ```powershell
   npm run dev
   ```

5. Open browser to `http://localhost:5173`

## Quick Commands

### Run Backend
```powershell
cd backend
npm start
```

### Run Frontend
```powershell
cd frontend
npm run dev
```

See `COMMANDS.md` for detailed command reference.

## Project Structure

```
Ai_Resume_Builder/
├── backend/                     # Express backend API (Node.js)
│   ├── index.js                 # Main server file with API routes
│   ├── package.json             # Backend dependencies
│   ├── .env                     # Backend environment variables (create this)
│   └── node_modules/            # Backend dependencies
├── frontend/                    # React frontend (TypeScript)
│   ├── src/                     # Source code
│   │   ├── components/          # React components
│   │   │   ├── Login.tsx        # Login/Signup component
│   │   │   ├── ResumeForm.tsx   # Resume form component
│   │   │   ├── ResumePreview.tsx # Resume preview component
│   │   │   └── AISuggestions.tsx # AI suggestions component
│   │   ├── utils/               # Utility functions
│   │   │   ├── api.ts           # API client for Express backend
│   │   │   ├── auth.ts          # Authentication utilities
│   │   │   ├── resumeStorage.ts # Resume storage functions
│   │   │   ├── exportResume.ts  # PDF/Text export functions
│   │   │   └── aiSuggestions.ts # AI suggestions utilities
│   │   ├── lib/                 # Library configurations
│   │   │   └── supabase.ts      # (Legacy - not used)
│   │   ├── types/               # TypeScript type definitions
│   │   │   └── resume.ts        # Resume data types
│   │   ├── App.tsx              # Main React component
│   │   ├── main.tsx             # React entry point
│   │   └── index.css            # Global styles
│   ├── index.html               # HTML entry point
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.ts           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── tsconfig.json            # TypeScript configuration
│   └── .env                     # Frontend environment variables (create this)
├── mysql-schema.sql             # MySQL database schema (run this first)
├── MYSQL_SETUP.md               # Detailed MySQL setup guide
├── COMMANDS.md                  # Command reference
├── README.md                    # This file
└── package.json                 # Root package.json (convenience scripts)
```

## Important Files

- **mysql-schema.sql** - Run this SQL file to create the database and tables
- **MYSQL_SETUP.md** - Complete setup instructions with troubleshooting
- **COMMANDS.md** - Quick reference for all commands
- **backend/.env** - Backend configuration (database credentials, JWT secret)
- **frontend/.env** - Frontend configuration (API URL)

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/resume` - Get user's resume
- `POST /api/resume` - Save/update resume
- `DELETE /api/resume` - Delete resume

## Development

### Backend Development
```powershell
cd backend
npm run dev  # Auto-reload on changes
```

### Frontend Development
```powershell
cd frontend
npm run dev  # Vite dev server with hot reload
```

## Build for Production

### Backend
```powershell
cd backend
npm start
```

### Frontend
```powershell
cd frontend
npm run build
npm run preview
```

## Troubleshooting

See `MYSQL_SETUP.md` for detailed troubleshooting guide.

Common issues:
- **Blank page**: Check that backend server is running and `.env` files are configured
- **Database connection error**: Verify MySQL is running and credentials are correct
- **CORS errors**: Ensure backend CORS is enabled and `VITE_API_URL` matches backend URL

## License

MIT

