# 🔧 Fix Database Error - RIGHT NOW

## ✅ I've Already Fixed It!

I've updated your `backend/.env` file to use default password: **`root`**

## 🚀 Next Steps (Do This Now)

### Step 1: Test the Connection

```powershell
cd backend
npm run test-db
```

**If you see:**
```
✅ Connection successful!
✅ Database is ready to use!
```
**→ SUCCESS! Go to Step 3**

**If you see:**
```
❌ Connection failed!
Error: Access denied
```
**→ Go to Step 2**

---

### Step 2: Try Other Default Passwords

If "root" doesn't work, try these common defaults:

**Option A: Try "password"**
1. Open `backend/.env`
2. Change: `DB_PASSWORD=root` to `DB_PASSWORD=password`
3. Test again: `npm run test-db`

**Option B: Try Empty (XAMPP)**
1. Open `backend/.env`
2. Change: `DB_PASSWORD=root` to `DB_PASSWORD=`
3. Test again: `npm run test-db`

**Option C: Use Your Actual Password**
1. Open `backend/.env`
2. Change: `DB_PASSWORD=root` to `DB_PASSWORD=your_actual_password`
3. Test again: `npm run test-db`

---

### Step 3: Create Database (If Needed)

If connection works but database doesn't exist:

```powershell
# From project root
mysql -u root -p < mysql-schema.sql
```

(Enter password: `root` or your password)

---

### Step 4: Start Backend

```powershell
cd backend
npm start
```

**You should see:**
```
✅ Database connected successfully
🚀 Server running on http://localhost:3001
```

---

## 🎯 Quick Command Summary

```powershell
# Test connection
cd backend
npm run test-db

# If successful, start server
npm start
```

---

## 💡 Most Likely Solutions

1. **Password is "root"** ✅ (Already set)
2. **Password is "password"** → Change in `.env`
3. **No password (XAMPP)** → Set `DB_PASSWORD=` (empty)
4. **Custom password** → Set your actual password

---

## 🆘 Still Not Working?

Run the automated fix script:

```powershell
cd backend
.\set-default-password.ps1
```

This will guide you through setting the correct password.

---

## ✅ That's It!

Once `npm run test-db` shows success, you're good to go!
