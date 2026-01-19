# ⚡ Quick Database Fix (2 Minutes)

## 🔍 The Problem
Your `.env` file has `DB_PASSWORD=` (empty). MySQL needs either:
- Your actual password, OR
- Confirmation that there's no password

## ✅ Quick Fix Steps

### Step 1: Open `backend/.env` File

### Step 2: Set Your MySQL Password

**If MySQL HAS a password:**
```env
DB_PASSWORD=your_actual_password_here
```

**If MySQL has NO password (XAMPP/WAMP default):**
```env
DB_PASSWORD=
```
(Keep it empty, but make sure the line exists)

### Step 3: Test the Connection

```powershell
cd backend
npm run test-db
```

**If successful, you'll see:**
```
✅ Connection successful!
✅ Database is ready to use!
```

**If it fails, you'll see specific error messages.**

### Step 4: Create Database (if needed)

If you see "Database does not exist":

```powershell
# From project root
mysql -u root -p < mysql-schema.sql
```

(Enter your MySQL password when prompted, or just press Enter if no password)

### Step 5: Restart Backend

```powershell
cd backend
npm start
```

**You should now see:**
```
✅ Database connected successfully
🚀 Server running on http://localhost:3001
```

## 🎯 That's It!

Your database connection should now work!

## 📚 Need More Help?

See `DATABASE_FIX.md` for detailed troubleshooting.
