# Database Setup Guide for Forge Studio

## Overview
Your Forge Studio application uses PostgreSQL as the database with Drizzle ORM for schema management. Google OAuth authentication is fully integrated with the database schema.

---

## Prerequisites

### System Requirements
- PostgreSQL 12+ installed
- Node.js 18+ and pnpm installed
- Access to your PostgreSQL installation

---

## Step 1: Create PostgreSQL Database

### Option A: Using PostgreSQL CLI (Recommended)

**Windows (PowerShell):**
```powershell
# Connect to PostgreSQL
psql -U postgres

# In psql:
CREATE DATABASE forgestudio;
\c forgestudio
\q
```

**Mac/Linux (Terminal):**
```bash
# Connect to PostgreSQL
psql -U postgres

# In psql:
CREATE DATABASE forgestudio;
\c forgestudio
\q
```

### Option B: Using pgAdmin (GUI)
1. Open pgAdmin
2. Right-click on "Databases"
3. Create → Database
4. Name: `forgestudio`
5. Click Save

---

## Step 2: Update Database Connection String

Edit **`artifacts/api-server/.env`** with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/forgestudio"
```

**Format breakdown:**
- `postgresql://` - Database protocol
- `postgres` - Default PostgreSQL username (change if different)
- `your-password` - Your PostgreSQL password
- `localhost` - Database host (change if remote)
- `5432` - PostgreSQL default port
- `forgestudio` - Database name

---

## Step 3: Run Database Migrations

Navigate to the database package and run migrations:

**Windows (PowerShell):**
```powershell
cd artifacts\api-server
pnpm run db:push
```

**Mac/Linux (Terminal):**
```bash
cd artifacts/api-server
pnpm run db:push
```

This command will:
1. Read schema from `lib/db/src/schema/`
2. Generate SQL migrations
3. Create all tables in your PostgreSQL database

---

## Step 4: Verify Database Creation

Connect to PostgreSQL and verify the tables:

```sql
-- Connect to forgestudio database
\c forgestudio

-- List all tables
\dt

-- Expected tables:
-- - users
-- - designs
-- - orders
-- - otps
-- - colors_fonts
```

Check the users table structure:

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
```

**Expected columns for Google OAuth:**
- `id` (serial, primary key)
- `email` (text, unique, not null)
- `password` (text, nullable)
- `googleId` (text, unique, nullable)
- `authProvider` (varchar, default: 'email')
- `isEmailVerified` (boolean, default: false)
- `firstName` (text)
- `lastName` (text)
- `profileImage` (text)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

---

## Step 5: Verify Database Connection from Backend

Start your backend server to test the database connection:

**Windows (PowerShell):**
```powershell
cd artifacts\api-server
pnpm install
pnpm dev
```

**Mac/Linux (Terminal):**
```bash
cd artifacts/api-server
pnpm install
pnpm dev
```

**Expected output:**
```
Server running on http://localhost:3000
Database connection: Connected
```

If you see connection errors:
1. Check database URL in `.env`
2. Verify PostgreSQL is running
3. Verify database `forgestudio` exists
4. Check credentials are correct

---

## Database Schema Overview

### Users Table (`users`)
Stores all user information including Google OAuth credentials.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| email | TEXT | Unique email address |
| googleId | TEXT | Google unique identifier (from OAuth) |
| authProvider | VARCHAR | 'email' or 'google' |
| firstName | TEXT | User's first name from Google profile |
| lastName | TEXT | User's last name |
| profileImage | TEXT | Google profile picture URL |
| isEmailVerified | BOOLEAN | Always true for Google accounts |
| password | TEXT | Hashed password (null for Google OAuth) |
| createdAt | TIMESTAMP | Account creation time |
| updatedAt | TIMESTAMP | Last update time |

### Designs Table
Stores user designs/templates created in Forge Studio.

### Orders Table
Stores customer orders and transactions.

### OTPs Table
Stores one-time passwords for verification.

### Colors & Fonts Table
Stores template color and font data.

---

## Common Database Tasks

### Reset Database (Delete All Data)

**WARNING: This deletes everything!**

```sql
-- Drop all tables
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS designs CASCADE;
DROP TABLE IF EXISTS otps CASCADE;
DROP TABLE IF EXISTS colors_fonts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Then run migrations again
pnpm run db:push
```

### Backup Database

**Windows:**
```powershell
pg_dump -U postgres forgestudio > backup.sql
```

**Mac/Linux:**
```bash
pg_dump -U postgres forgestudio > backup.sql
```

### Restore from Backup

**Windows:**
```powershell
psql -U postgres forgestudio < backup.sql
```

**Mac/Linux:**
```bash
psql -U postgres forgestudio < backup.sql
```

### Check Database Size

```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Google OAuth & Database

### How Google OAuth Works with Database

1. **User Sign-Up via Google:**
   - User clicks "Sign up with Google"
   - Google returns: `googleId`, `email`, `name`, `picture`
   - New user record created with:
     - `googleId` = unique identifier from Google
     - `authProvider` = 'google'
     - `isEmailVerified` = true (auto-verified)
     - `firstName`, `lastName`, `profileImage` from Google profile

2. **User Sign-In via Google:**
   - User clicks "Sign in with Google"
   - System checks if `googleId` exists in database
   - If found → Return session token
   - If not found → Create new account (auto-signup)

3. **Account Linking:**
   - Email user can link Google account later
   - System matches by email address
   - Both auth methods can be used interchangeably

---

## Troubleshooting

### Database Connection Failed

**Error: "connect ECONNREFUSED 127.0.0.1:5432"**

Solutions:
1. Start PostgreSQL service
   - Windows: Services → PostgreSQL → Start
   - Mac: `brew services start postgresql`
   - Linux: `sudo systemctl start postgresql`

2. Check connection string in `.env`
3. Verify PostgreSQL credentials
4. Test connection: `psql -U postgres -d forgestudio`

### Table Not Found

**Error: "relation 'users' does not exist"**

Solution:
```bash
cd artifacts/api-server
pnpm run db:push
```

This runs migrations and creates all tables.

### Permission Denied

**Error: "user 'postgres' has no permission"**

Solution:
```sql
-- Run as PostgreSQL admin
ALTER USER postgres PASSWORD 'newpassword';
GRANT ALL PRIVILEGES ON DATABASE forgestudio TO postgres;
```

### Port Already in Use

If PostgreSQL is already running on port 5432, either:
1. Stop the existing instance
2. Or change port in `DATABASE_URL`

---

## Environment Configuration

Your **`.env`** file is already configured with:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/forgestudio"
JWT_SECRET="your-secret-key-min-32-chars"
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
```

**Before Production:**
- Change JWT_SECRET to a random 32+ character string
- Update DATABASE_URL to point to production database
- Update FRONTEND_URL to your production domain
- Set NODE_ENV="production"

---

## What's Next?

1. ✅ Create PostgreSQL database
2. ✅ Update DATABASE_URL in `.env`
3. ✅ Run `pnpm run db:push`
4. ✅ Verify tables were created
5. → Start backend: `pnpm dev`
6. → Start frontend: `cd ../designforge && pnpm dev`
7. → Test Google OAuth at http://localhost:5173/login

---

## Need Help?

**Check logs:**
- Backend logs: Terminal where `pnpm dev` is running
- Database logs: PostgreSQL logs (check installation directory)
- Browser console: Open DevTools (F12) and check Console tab

**Verify database:**
```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM designs;
```

Should return "0" rows if database is fresh and empty.

---

**Status**: ✅ Database ready for Google OAuth authentication
