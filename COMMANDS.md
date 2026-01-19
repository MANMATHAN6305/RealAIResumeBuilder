# Commands to Run Frontend and Backend

## Quick Start Commands

### Backend Server (Terminal 1)

```powershell
# Navigate to backend folder
cd backend

# Install dependencies (first time only)
npm install

# Start backend server
npm start

# Or for development with auto-reload
npm run dev
```

**Backend will run on:** `http://localhost:3001`

---

### Frontend Server (Terminal 2)

```powershell
# Navigate to frontend folder
cd frontend

# Install dependencies (first time only)
npm install

# Start frontend development server
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

---

## Complete Setup Commands

### 1. Database Setup (One-time)

```powershell
# Run MySQL schema
mysql -u root -p < mysql-schema.sql
```

### 2. Backend Setup

```powershell
cd backend
npm install
# Create .env file with database credentials
npm start
```

### 3. Frontend Setup

```powershell
cd frontend
npm install
# Create .env file with API URL
npm run dev
```

---

## Running Both Servers

### Option 1: Two Separate Terminals

**Terminal 1 (Backend):**
```powershell
cd backend
npm start
```

**Terminal 2 (Frontend):**
```powershell
cd frontend
npm run dev
```

### Option 2: Using PowerShell Background Jobs

```powershell
# Start backend in background
Start-Job -ScriptBlock { cd backend; npm start }

# Start frontend in background
Start-Job -ScriptBlock { cd frontend; npm run dev }
```

### Option 3: Using npm-run-all (if installed)

```powershell
# From root directory
npm run dev:all
```

---

## Stop Servers

- Press `Ctrl + C` in each terminal
- Or close the terminal windows

---

## Verify Servers Are Running

### Check Backend:
```powershell
Invoke-WebRequest -Uri http://localhost:3001/api/health
```

### Check Frontend:
Open browser to: `http://localhost:5173`

---

## Troubleshooting

### Port Already in Use
- Backend (3001): Change `PORT` in `backend/.env`
- Frontend (5173): Vite will automatically use next available port

### Dependencies Not Installed
```powershell
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Database Connection Error
- Check MySQL is running
- Verify `backend/.env` has correct database credentials
