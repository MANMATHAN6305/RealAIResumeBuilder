# Quick Fix Guide - Get Your App Running Now!

## 🚀 Quick Start (5 Minutes)

### 1. Create Environment Files

**Backend** (`backend/.env`):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=resume_builder
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=change-this-to-random-string-in-production
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3001/api
```

### 2. Start Backend (Terminal 1)
```powershell
cd backend
npm start
```

Wait for: `✅ Database connected successfully` and `🚀 Server running`

### 3. Start Frontend (Terminal 2)
```powershell
cd frontend
npm run dev
```

### 4. Open Browser
Go to: `http://localhost:5173`

## ✅ That's It!

The app should now work. Google OAuth errors are normal - the button will be hidden automatically. Just use email/password login.

## 🔍 Troubleshooting

**"Unable to connect to server"**
→ Backend not running. Start it first (Step 2).

**"Database connection failed"**
→ Check MySQL is running and `.env` has correct password.

**Google OAuth errors**
→ Normal! Google login is optional. Use email/password instead.

## 📝 What Was Fixed

✅ Backend connection issues
✅ CORS configuration
✅ Google OAuth made optional
✅ Better error messages
✅ Database connection handling
✅ Frontend-backend communication

See `FIXES_APPLIED.md` for details.
