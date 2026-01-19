# Setup Checklist - AI Resume Builder

## ✅ Pre-requisites

- [ ] Node.js 18+ installed
- [ ] MySQL Server installed and running
- [ ] npm or yarn package manager

## 📋 Setup Steps

### 1. Database Setup

- [ ] MySQL server is running
- [ ] Run database schema:
  ```powershell
  mysql -u root -p < mysql-schema.sql
  ```
- [ ] Verify database `resume_builder` exists
- [ ] Verify tables `users` and `resumes` exist

### 2. Backend Setup

- [ ] Navigate to `backend/` directory
- [ ] Install dependencies: `npm install`
- [ ] Create `backend/.env` file with:
  ```env
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=your_mysql_password
  DB_NAME=resume_builder
  PORT=3001
  JWT_SECRET=your-random-secret-key-min-32-chars
  FRONTEND_URL=http://localhost:5173
  ```
- [ ] Start backend: `npm start` or `npm run dev`
- [ ] Verify backend is running: Check console for "🚀 Server running"
- [ ] Test health endpoint: `http://localhost:3001/api/health`

### 3. Frontend Setup

- [ ] Navigate to `frontend/` directory
- [ ] Install dependencies: `npm install`
- [ ] Create `frontend/.env` file with:
  ```env
  VITE_API_URL=http://localhost:3001/api
  ```
- [ ] Start frontend: `npm run dev`
- [ ] Verify frontend is running: Check console for localhost URL
- [ ] Open browser to frontend URL (usually `http://localhost:5173`)

### 4. Testing

- [ ] Backend health check works
- [ ] Frontend loads without errors
- [ ] Can access login page
- [ ] Can create new account (Sign Up)
- [ ] Can login with email/password
- [ ] Can access resume builder after login

## 🔧 Troubleshooting

### Backend Issues

**Problem**: "Database connection failed"
- ✅ Check MySQL is running
- ✅ Verify database credentials in `backend/.env`
- ✅ Ensure database `resume_builder` exists
- ✅ Run `mysql-schema.sql` to create tables

**Problem**: "Port 3001 already in use"
- ✅ Change `PORT` in `backend/.env`
- ✅ Update `VITE_API_URL` in `frontend/.env` to match

**Problem**: "CORS error"
- ✅ Check `FRONTEND_URL` in `backend/.env` matches frontend URL
- ✅ Verify CORS is enabled in backend code

### Frontend Issues

**Problem**: "Unable to connect to server"
- ✅ Verify backend is running on port 3001
- ✅ Check `VITE_API_URL` in `frontend/.env`
- ✅ Test backend health endpoint manually

**Problem**: "Blank page"
- ✅ Check browser console for errors
- ✅ Verify all dependencies are installed
- ✅ Check that `.env` file exists in `frontend/`

### Google OAuth Issues

**Problem**: "Google OAuth error" or "invalid_client"
- ✅ This is normal if Google OAuth is not configured
- ✅ Google sign-in button will be hidden automatically
- ✅ Use email/password login instead
- ✅ To enable Google OAuth:
  1. Create Google OAuth credentials at https://console.cloud.google.com
  2. Add `GOOGLE_CLIENT_ID` to `backend/.env`
  3. Add `VITE_GOOGLE_CLIENT_ID` to `frontend/.env`

## ✅ Verification Commands

### Check Backend
```powershell
Invoke-WebRequest -Uri http://localhost:3001/api/health
```

### Check Frontend
Open browser: `http://localhost:5173`

### Check Database
```sql
USE resume_builder;
SHOW TABLES;
SELECT COUNT(*) FROM users;
```

## 📝 Notes

- Google OAuth is **optional** - the app works without it
- Email/password authentication is the primary method
- All errors are logged to console for debugging
- Backend must be running before frontend can connect
