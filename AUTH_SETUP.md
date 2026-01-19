# Authentication System Setup Guide

## Overview
This guide covers the complete authentication system implementation including email/password registration, Google OAuth, and session management.

## Prerequisites
- Node.js (v16+)
- MySQL/MariaDB running
- Google Cloud Project (for Google OAuth)

## Database Setup

### 1. Create/Update Database Schema
Run the updated `mysql-schema.sql` file to update your database:

```bash
mysql -u root -p resume_builder < mysql-schema.sql
```

The new `users` table includes:
- `first_name` - User's first name (required)
- `last_name` - User's last name (required)  
- `email` - User's email (unique, required)
- `password_hash` - Bcrypt hashed password (for local auth)
- `date_of_birth` - User's date of birth (required)
- `auth_provider` - Authentication method ('local' or 'google')
- `google_id` - Google ID (for Google OAuth users)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### 2. Update Database Credentials
Edit `server/.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=resume_builder
PORT=3001
JWT_SECRET=your-secure-random-secret-key
```

## Google OAuth Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
4. Choose "Web application"
5. Add authorized redirect URIs:
   - `http://localhost:3000` (frontend)
   - `http://localhost:3001` (backend)
6. Save your Client ID

### 2. Configure Google OAuth IDs
Update both `.env` files with your Google Client ID:

**`server/.env`:**
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
```

**`.env`:**
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Backend Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

The following packages are installed:
- `express` - Web server
- `mysql2` - MySQL database driver
- `cors` - Cross-origin resource sharing
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation
- `dotenv` - Environment variable management
- `google-auth-library` - Google OAuth verification

### 2. Start Backend Server
```bash
npm run dev  # Development with auto-reload
# or
npm start    # Production
```

Expected output:
```
🚀 Server running on http://localhost:3001
📊 Database: resume_builder
```

## Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Frontend Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or specified Vite port)

## Authentication Flows

### Email/Password Registration
1. User clicks "Sign up"
2. Fills in: First Name, Last Name, Email, Date of Birth, Password (min 8 chars)
3. Backend validates and hashes password with bcrypt
4. User created in database with `auth_provider = 'local'`
5. JWT token generated and stored in localStorage
6. User redirected to resume builder

### Email/Password Login
1. User clicks "Sign in"
2. Enters email and password
3. Backend finds user by email and `auth_provider = 'local'`
4. Password verified with bcrypt
5. JWT token generated and stored
6. User redirected to resume builder

### Google Sign-In (First Time)
1. User clicks "Sign in with Google"
2. Google OAuth redirect and token exchange
3. Backend verifies Google token
4. Google ID checked - if exists, login directly
5. If first-time user without profile details:
   - Return HTTP 202 with profile completion request
   - Frontend redirects to profile completion
6. User enters missing details (First Name, Last Name, Date of Birth)
7. Backend creates user with `auth_provider = 'google'` and `google_id`
8. JWT token generated and stored
9. User redirected to resume builder

### Google Sign-In (Returning User)
1. User clicks "Sign in with Google"
2. Backend verifies Google token
3. User found by Google ID
4. JWT token generated
5. User logged in directly to resume builder

## API Endpoints

### Register (Email/Password)
```
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "dateOfBirth": "1990-01-15"
}

Response (201 Created):
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Login (Email/Password)
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (200 OK):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Google Sign-In
```
POST /api/auth/google
Content-Type: application/json

{
  "token": "google_id_token"
}

Response (201 Created - New User with profile):
{
  "message": "Google login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@gmail.com",
    "firstName": "John",
    "lastName": "Doe",
    "isNewUser": true
  }
}

Response (202 Accepted - First-time user needs profile completion):
{
  "message": "Profile completion required",
  "requiresCompletion": true,
  "googleId": "123456789",
  "email": "john@gmail.com",
  "existingFirstName": "John",
  "existingLastName": "Doe",
  "picture": "https://..."
}

Response (200 OK - Returning user):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@gmail.com",
    "firstName": "John",
    "lastName": "Doe",
    "isNewUser": false
  }
}
```

### Complete Google Profile
```
POST /api/auth/google/complete
Content-Type: application/json

{
  "googleId": "123456789",
  "email": "john@gmail.com",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-15"
}

Response (201 Created):
{
  "message": "Profile completed successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@gmail.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

## Testing the Authentication

### 1. Test Email/Password Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "TestPassword123",
    "dateOfBirth": "1990-01-15"
  }'
```

### 2. Test Email/Password Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

### 3. Test with Frontend
1. Start both backend and frontend servers
2. Go to `http://localhost:5173`
3. Click "Get Started"
4. Test "Sign up" flow with new account
5. Test "Sign in" flow with email/password
6. Test "Sign in with Google" (if Google OAuth is configured)

## Frontend Components

### Login.tsx
- Email/password login form
- Google Sign-In button integration
- Error and success message display
- Redirect to SignUp page

### SignUp.tsx
- Complete registration form
- First Name, Last Name, Email, Date of Birth, Password fields
- Password validation (minimum 8 characters)
- Age validation (minimum 13 years old)
- Success message and redirect

### App.tsx
- Navigation between Home, Login, SignUp, and Builder views
- User session persistence
- Logout functionality with token cleanup
- User email display in header

## Session Management

### Token Storage
- JWT token stored in `localStorage` as `authToken`
- Token automatically included in all API requests via `Authorization: Bearer <token>` header
- Token expires in 7 days

### Token Verification
- Backend validates JWT signature and expiration
- Returns 401 if token is missing or invalid
- Returns 403 if token is expired

### Logout
- Clears `authToken` from localStorage
- Resets user state in frontend
- Redirects to home page

## Security Best Practices

1. **Password Hashing**: All passwords are hashed with bcrypt (10 rounds)
2. **CORS Configuration**: Backend allows requests from frontend origin
3. **JWT Tokens**: Signed with secret key, expires in 7 days
4. **Input Validation**: Email format, password length, date validation on both frontend and backend
5. **SQL Injection Protection**: Using parameterized queries with mysql2
6. **Secure Password Requirements**: Minimum 8 characters
7. **Age Validation**: Users must be at least 13 years old
8. **Duplicate Email Prevention**: Unique constraint on email column
9. **Google OAuth**: Token verification with google-auth-library

## Troubleshooting

### "Failed to Login" with correct credentials
- Check backend is running on port 3001
- Verify database has been updated with new schema
- Check MySQL connection in .env
- Look at browser console for API errors
- Check server console for detailed error logs

### Google Sign-In not working
- Verify VITE_GOOGLE_CLIENT_ID is set correctly in .env
- Check Google Cloud Console for correct OAuth credentials
- Ensure localhost:3000/5173 is in authorized redirect URIs
- Clear browser cache and localStorage
- Check browser console for Google API errors

### "Invalid email or password"
- Ensure you're using correct credentials
- Remember that registration creates a local auth user
- Google users have auth_provider = 'google' and won't work with password login
- For Google users, use Google Sign-In instead

### Database errors
- Ensure MySQL is running
- Verify database credentials in server/.env
- Run mysql-schema.sql to update tables
- Check MySQL error logs for connection issues

## Environment Variables Checklist

**Server (.env):**
- [ ] DB_HOST
- [ ] DB_USER
- [ ] DB_PASSWORD
- [ ] DB_NAME
- [ ] PORT (default: 3001)
- [ ] JWT_SECRET (use random string in production)
- [ ] GOOGLE_CLIENT_ID (for Google OAuth)

**Frontend (.env):**
- [ ] VITE_API_URL (usually http://localhost:3001/api)
- [ ] VITE_GOOGLE_CLIENT_ID (matches server)

## Next Steps

1. ✅ Update database schema
2. ✅ Configure MySQL credentials
3. ✅ Set up Google OAuth (optional but recommended)
4. ✅ Install dependencies
5. ✅ Start backend server
6. ✅ Start frontend development server
7. ✅ Test all authentication flows
8. ✅ Verify resume saves/loads correctly

## Production Deployment

When deploying to production:

1. Generate secure random JWT_SECRET: `openssl rand -base64 32`
2. Update database credentials for production MySQL
3. Set VITE_API_URL to production backend URL
4. Update Google OAuth redirect URIs to production domain
5. Use HTTPS for all connections
6. Enable CORS only for your domain
7. Set NODE_ENV=production
8. Use environment variables for all secrets (never commit .env)

---

For issues or questions, check server and browser console logs for detailed error messages.
