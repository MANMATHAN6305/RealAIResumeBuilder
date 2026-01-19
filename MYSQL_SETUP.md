# MySQL Backend Setup Guide

This guide will help you set up the MySQL backend for the AI Resume Builder application.

## Prerequisites

1. MySQL Server installed (version 5.7+ or 8.0+)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP/MAMP for easy setup
2. Node.js installed (version 18+)

## Step 1: Set Up MySQL Database

1. Start your MySQL server
2. Open MySQL command line client or MySQL Workbench
3. Run the SQL script to create the database and tables:

```bash
mysql -u root -p < mysql-schema.sql
```

Or manually:
1. Open MySQL client
2. Run: `source mysql-schema.sql` (if in MySQL command line)
3. Or copy and paste the contents of `mysql-schema.sql` into your MySQL client

This will create:
- Database: `resume_builder`
- Tables: `users`, `resumes`, `ai_suggestions`

## Step 2: Configure Backend Server

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=resume_builder
   PORT=3001
   JWT_SECRET=your-random-secret-key-change-this-in-production
   ```

4. Update the values:
   - `DB_PASSWORD`: Your MySQL root password (or create a new MySQL user)
   - `JWT_SECRET`: A random string for JWT token signing (use a strong random string)

## Step 3: Start Backend Server

1. In the `server` directory, start the server:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

2. You should see:
   ```
   🚀 Server running on http://localhost:3001
   📊 Database: resume_builder
   ```

## Step 4: Configure Frontend

1. Create a `.env` file in the root `Ai_Resume_Builder` directory:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

2. If the backend is on a different port or host, update accordingly.

## Step 5: Start Frontend

1. In the root `Ai_Resume_Builder` directory:
   ```bash
   npm run dev
   ```

2. The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## Step 6: Test the Setup

1. Open your browser to `http://localhost:5173`
2. Click "Get Started"
3. Try creating a new account (Sign Up)
4. After logging in, create and save a resume
5. Check your MySQL database to verify data is being saved:
   ```sql
   USE resume_builder;
   SELECT * FROM users;
   SELECT * FROM resumes;
   ```

## API Endpoints

The backend provides the following endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Resume Management
- `GET /api/resume` - Get user's resume (requires auth)
- `POST /api/resume` - Save/update resume (requires auth)
- `DELETE /api/resume` - Delete resume (requires auth)

### Health Check
- `GET /api/health` - Check if server is running

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Protected API routes (require authentication)
- ✅ SQL injection protection (using parameterized queries)
- ✅ CORS enabled for frontend

## Troubleshooting

### "Cannot connect to MySQL"
- Ensure MySQL server is running
- Check database credentials in `.env`
- Verify database exists: `SHOW DATABASES;`

### "Access denied for user"
- Check MySQL username and password in `.env`
- Ensure MySQL user has proper permissions:
  ```sql
  GRANT ALL PRIVILEGES ON resume_builder.* TO 'your_user'@'localhost';
  FLUSH PRIVILEGES;
  ```

### "Port 3001 already in use"
- Change `PORT` in server `.env` file
- Update `VITE_API_URL` in frontend `.env` to match

### "CORS error" in browser
- Ensure backend server is running
- Check that `VITE_API_URL` matches the backend URL
- Verify CORS is enabled in `server/index.js`

### Frontend shows blank page
- Check browser console for errors
- Verify backend server is running
- Check that `.env` files are configured correctly

## Database Schema

The database includes:

- **users**: Stores user accounts with hashed passwords
- **resumes**: Stores resume data as JSON fields
- **ai_suggestions**: Stores AI suggestions (for future use)

All tables use InnoDB engine with UTF8MB4 encoding for full Unicode support.

## Production Deployment

For production:
1. Use environment variables for all sensitive data
2. Change `JWT_SECRET` to a strong random string
3. Use HTTPS for API communication
4. Set up proper MySQL user with limited permissions
5. Enable MySQL SSL connections
6. Use a process manager like PM2 for the Node.js server
7. Set up proper logging and monitoring

