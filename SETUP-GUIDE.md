# 🚀 Quick Setup Guide

## Problem: "Failed to add quiz" Error

This error occurs when the database connection is not configured. Follow these steps:

## ✅ Step-by-Step Fix

### 1. Check if `.env.local` exists
```bash
ls -la .env.local
```

If it doesn't exist, create it:
```bash
touch .env.local
```

### 2. Set Up Vercel Postgres

**Option A: Use Vercel (Recommended)**
1. Go to https://vercel.com
2. Create a new project or select existing
3. Go to **Storage** tab
4. Click **Create Database** → Select **Postgres**
5. Copy all the environment variables

**Option B: Use Local Postgres (Development)**
If you have PostgreSQL installed locally:
```env
POSTGRES_URL="postgresql://user:password@localhost:5432/quizme"
POSTGRES_PRISMA_URL="postgresql://user:password@localhost:5432/quizme"
POSTGRES_URL_NON_POOLING="postgresql://user:password@localhost:5432/quizme"
POSTGRES_USER="your_user"
POSTGRES_HOST="localhost"
POSTGRES_PASSWORD="your_password"
POSTGRES_DATABASE="quizme"
```

### 3. Add Credentials to `.env.local`

Open `.env.local` and paste your Vercel Postgres credentials:
```env
POSTGRES_URL="postgres://default:xxxxx@xxxxx.postgres.vercel-storage.com:5432/verceldb"
POSTGRES_PRISMA_URL="postgres://default:xxxxx@xxxxx.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://default:xxxxx@xxxxx.postgres.vercel-storage.com:5432/verceldb"
POSTGRES_USER="default"
POSTGRES_HOST="xxxxx.postgres.vercel-storage.com"
POSTGRES_PASSWORD="xxxxx"
POSTGRES_DATABASE="verceldb"
```

### 4. Initialize Database

Visit this URL in your browser (with dev server running):
```
http://localhost:3000/api/init-db
```

You should see:
```json
{
  "success": true,
  "message": "Database initialized successfully! Tables created."
}
```

If you see an error, check the error message for details.

### 5. Restart Dev Server

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

### 6. Try Adding Quiz Again

1. Go to http://localhost:3000/admin/add-quiz
2. Fill in the form
3. Submit

Now you should see detailed error messages if something goes wrong!

## 🔍 Debugging Tips

### Check if environment variables are loaded
Create a test file `app/api/test-db/route.ts`:
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasPostgresUrl: !!process.env.POSTGRES_URL,
    postgresUrlPrefix: process.env.POSTGRES_URL?.substring(0, 20) || 'not set'
  });
}
```

Visit: http://localhost:3000/api/test-db

### Check Browser Console
Open browser DevTools (F12) → Console tab to see detailed error messages

### Check Terminal/Server Logs
Look at your terminal where `npm run dev` is running for error messages

## 🎯 Common Issues

### Issue 1: "relation 'quizzes' does not exist"
**Solution:** Visit http://localhost:3000/api/init-db to create tables

### Issue 2: "password authentication failed"
**Solution:** Double-check your Vercel Postgres credentials in `.env.local`

### Issue 3: ".env.local not found"
**Solution:** Make sure the file is in the root directory (same level as package.json)

### Issue 4: "Cannot connect to database"
**Solution:** 
- Check if Vercel Postgres database is active
- Verify the connection string is correct
- Try using the non-pooling URL

## ✨ Success Checklist

- [ ] `.env.local` file exists in root directory
- [ ] Vercel Postgres database created
- [ ] Environment variables copied to `.env.local`
- [ ] Visited `/api/init-db` successfully
- [ ] Dev server restarted
- [ ] Can add quiz without errors

## 📞 Still Having Issues?

Check the detailed error message now displayed in the admin panel. It will tell you exactly what's wrong!

The error message will include:
- The specific error from the database
- A hint about what to check
- Details about the failure

---

**Need more help?** Check the main README.md for full documentation.
