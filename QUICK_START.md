# Quick Start - Authentication System

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js installed
- MySQL running
- Your Google Client ID (optional)

### Step 1: Update Database (1 minute)
```bash
# Run the updated schema
mysql -u root -p resume_builder < mysql-schema.sql

# Enter your MySQL password when prompted
```

### Step 2: Configure Environment Variables (1 minute)

**Edit `server/.env`:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=resume_builder
PORT=3001
JWT_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your_google_client_id_here  # Optional
```

**Edit `.env` (in root):**
```env
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here  # Optional
```

### Step 3: Install Dependencies (1 minute)
```bash
# Backend
cd server
npm install

# Frontend (in new terminal, from root)
npm install
```

### Step 4: Start Servers (1 minute)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Wait for: 🚀 Server running on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Wait for: VITE v... ready in ... ms
```

### Step 5: Test It! (1 minute)

1. Open http://localhost:5173
2. Click "Get Started"
3. Click "Don't have an account? Sign up"
4. Fill in form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Date of Birth: 1990-01-15
   - Password: SecurePass123
5. Click "Sign Up"
6. You should be in the resume builder! ✅

## Testing All Flows

### Test 1: Sign Up (New Account)
- Navigate to Sign Up page
- Enter all required fields
- Verify account created and token saved
- Verify resume builder loads

### Test 2: Sign Out & Log In
- Click "Sign Out" in top right
- Go back to home page
- Click "Get Started"
- Use Sign In with email/password from Test 1
- Should load your resume builder again

### Test 3: Google Sign-In (If Configured)
- Make sure VITE_GOOGLE_CLIENT_ID is set
- Click "Get Started"
- Click Google Sign-In button
- Complete OAuth flow
- If first time: complete profile details
- Should be in resume builder

## What Changed From Original

### Added Components
- ✅ Separate Sign Up page with full form
- ✅ Google Sign-In button on Login page
- ✅ Updated Login page with better UX

### Database
- ✅ Added: first_name, last_name, date_of_birth
- ✅ Changed: password → password_hash
- ✅ Added: auth_provider (local/google)
- ✅ Added: google_id for OAuth users

### Backend
- ✅ Enhanced registration with more fields
- ✅ Added Google OAuth endpoints
- ✅ Fixed password field name (password_hash)
- ✅ Better error handling

### Frontend
- ✅ New SignUp component
- ✅ Updated Login with Google Sign-In
- ✅ New auth utilities for Google
- ✅ User email in header
- ✅ Sign Out button

## Verify Everything Works

### Browser Console Check
Open DevTools (F12) → Console tab while testing

**During Sign Up:**
```
Calling register API for: john@example.com
Register API response: {message: "User created successfully", ...}
Sign up successful, user ID: 1
```

**During Sign In:**
```
Calling login API for: john@example.com
Login API response: {message: "Login successful", ...}
Login successful, user ID: 1
```

**If error:**
```
Sign in error: Failed to login. Please check your credentials.
Login failed - no user data: null
```
→ Check server console for details

### Server Console Check
Open terminal where backend is running

**Expected on login:**
```
Login successful for user: john@example.com (ID: 1)
```

**If error:**
```
Login attempt failed: User not found for email: john@example.com
Login attempt failed: Invalid password for email: john@example.com
```

## Troubleshooting

### ❌ "Failed to Login" with correct credentials
**Solution:**
1. Is backend running? Check terminal
2. Is database updated? Run mysql-schema.sql again
3. Check browser console for exact error
4. Check server console for detailed error

### ❌ Google Sign-In button not showing
**Solution:**
1. Check VITE_GOOGLE_CLIENT_ID in .env
2. Clear browser cache (Ctrl+Shift+Delete)
3. Refresh page
4. Check browser console for errors

### ❌ "Database connection error"
**Solution:**
1. Is MySQL running? Start it
2. Check credentials in server/.env
3. Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### ❌ "Port already in use"
**Solution:**
```bash
# Change port in server/.env
PORT=3002

# Or kill process on port 3001
# Windows:
netstat -ano | findstr :3001
taskkill /PID [PID] /F

# Mac/Linux:
lsof -i :3001
kill -9 [PID]
```

## Database Reset (If Needed)

If something goes wrong and you need to start fresh:

```bash
# Drop and recreate database
mysql -u root -p -e "DROP DATABASE IF EXISTS resume_builder;"
mysql -u root -p < mysql-schema.sql

# Backend will automatically create tables on first request
```

## Next Steps

### To Enable Google Sign-In:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Credentials → OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - http://localhost:3000
   - http://localhost:5173
4. Copy Client ID to both .env files

See [AUTH_SETUP.md](AUTH_SETUP.md) for detailed steps.

### To Deploy:
See "Production Deployment" section in [AUTH_SETUP.md](AUTH_SETUP.md)

---

## Success Checklist ✅

- [ ] Database updated with new schema
- [ ] server/.env configured with DB credentials
- [ ] .env configured with VITE_API_URL
- [ ] Dependencies installed (npm install in both folders)
- [ ] Backend running (npm run dev in server folder)
- [ ] Frontend running (npm run dev in root folder)
- [ ] Can sign up with new account
- [ ] Can sign in with email/password
- [ ] Resume builder loads and saves
- [ ] Can sign out and log back in
- [ ] (Optional) Google Sign-In working

**When all checked → You're done! 🎉**
