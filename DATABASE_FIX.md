# Database Connection Fix - Step by Step Guide

## 🔍 Current Issue
Your `.env` file shows `DB_PASSWORD=` (empty). You need to set your MySQL password.

## ✅ Step-by-Step Fix

### Step 1: Find Your MySQL Password

**Option A: If you know your MySQL root password**
- Use that password in Step 2

**Option B: If you don't remember your password**
- Check if you have MySQL installed via XAMPP/WAMP/MAMP:
  - XAMPP: Usually no password (leave empty or use `""`)
  - WAMP: Usually no password
  - MAMP: Check MAMP settings
  - Standalone MySQL: Check your installation notes

**Option C: Reset MySQL Password (if needed)**
```powershell
# Stop MySQL service
net stop MySQL80  # or MySQL, MySQL57, etc.

# Start MySQL in safe mode (skip grant tables)
# Then reset password - see MySQL documentation
```

### Step 2: Update backend/.env File

Open `backend/.env` and set your MySQL password:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_mysql_password_here
DB_NAME=resume_builder
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production-use-random-string
```

**Important:**
- If MySQL has NO password, use: `DB_PASSWORD=`
- If MySQL has a password, enter it: `DB_PASSWORD=mypassword123`
- Remove any quotes around the password

### Step 3: Verify MySQL is Running

**Check if MySQL service is running:**
```powershell
Get-Service -Name "*mysql*"
```

**Or check if MySQL is accessible:**
```powershell
mysql -u root -p
```

**If MySQL is not running:**
- Start MySQL service:
  ```powershell
  net start MySQL80  # or your MySQL service name
  ```
- Or start via XAMPP/WAMP/MAMP control panel

### Step 4: Create Database (if it doesn't exist)

```powershell
# Connect to MySQL
mysql -u root -p

# Then run these SQL commands:
CREATE DATABASE IF NOT EXISTS resume_builder;
USE resume_builder;

# Exit MySQL
exit;
```

### Step 5: Run Database Schema

```powershell
# From project root
mysql -u root -p < mysql-schema.sql
```

**Or manually:**
1. Open MySQL Workbench or phpMyAdmin
2. Select `resume_builder` database
3. Run the SQL from `mysql-schema.sql` file

### Step 6: Test Database Connection

**Test from command line:**
```powershell
mysql -u root -p -e "USE resume_builder; SHOW TABLES;"
```

**Should show:**
```
+---------------------------+
| Tables_in_resume_builder  |
+---------------------------+
| users                     |
| resumes                   |
| ai_suggestions            |
+---------------------------+
```

### Step 7: Restart Backend Server

```powershell
cd backend
npm start
```

**You should now see:**
```
✅ Database connected successfully
🚀 Server running on http://localhost:3001
```

## 🔧 Common Issues & Solutions

### Issue 1: "Access denied for user 'root'@'localhost'"
**Solution:**
- Wrong password in `.env` file
- Update `DB_PASSWORD` in `backend/.env`

### Issue 2: "Unknown database 'resume_builder'"
**Solution:**
- Database doesn't exist
- Run: `mysql -u root -p < mysql-schema.sql`

### Issue 3: "Can't connect to MySQL server"
**Solution:**
- MySQL service not running
- Start MySQL service
- Check MySQL is listening on port 3306

### Issue 4: "MySQL service not found"
**Solution:**
- MySQL not installed
- Install MySQL or use XAMPP/WAMP/MAMP
- Download from: https://dev.mysql.com/downloads/mysql/

## 📝 Quick Test Script

Create `test-db.ps1` in project root:

```powershell
$password = Read-Host "Enter MySQL root password (or press Enter for no password)" -AsSecureString
$plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

if ($plainPassword) {
    mysql -u root -p$plainPassword -e "USE resume_builder; SHOW TABLES;"
} else {
    mysql -u root -e "USE resume_builder; SHOW TABLES;"
}
```

## ✅ Verification Checklist

- [ ] MySQL service is running
- [ ] `DB_PASSWORD` is set correctly in `backend/.env`
- [ ] Database `resume_builder` exists
- [ ] Tables `users`, `resumes`, `ai_suggestions` exist
- [ ] Backend shows "✅ Database connected successfully"

## 🆘 Still Having Issues?

1. **Check MySQL error log:**
   - Usually in: `C:\ProgramData\MySQL\MySQL Server X.X\Data\`
   - Or check XAMPP/WAMP logs

2. **Test connection manually:**
   ```powershell
   mysql -u root -p
   ```

3. **Check MySQL port:**
   - Default is 3306
   - If different, add to `.env`: `DB_PORT=3307`

4. **Try creating a test user:**
   ```sql
   CREATE USER 'resume_user'@'localhost' IDENTIFIED BY 'password123';
   GRANT ALL PRIVILEGES ON resume_builder.* TO 'resume_user'@'localhost';
   FLUSH PRIVILEGES;
   ```
   Then use `resume_user` in `.env`
