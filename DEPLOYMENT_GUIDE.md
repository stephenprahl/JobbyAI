# Full-Stack Deployment Guide

## Overview

Your JobbyAI application is a full-stack app with:

- **Frontend**: React + Vite (can deploy to Vercel)
- **Backend**: Bun + Elysia (needs Railway/Render for Bun support)
- **Database**: PostgreSQL (Prisma)

## 🚀 Recommended Deployment Strategy

### Option 1: Railway (Backend) + Vercel (Frontend) - RECOMMENDED

#### Step 1: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app) and sign up
2. Connect your GitHub repository
3. Select "Deploy from GitHub repo"
4. Choose your JobbyAI repository
5. Railway will automatically detect Bun and deploy your backend
6. Set these environment variables in Railway:

   ```
   DATABASE_URL=your_postgresql_connection_string
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret
   NODE_ENV=production
   ```

#### Step 2: Update Vercel Frontend to Point to Railway

1. In Vercel dashboard, go to your project settings
2. Add environment variable:

   ```
   VITE_API_BASE_URL=https://your-railway-app.railway.app/api
   ```

3. Redeploy your Vercel frontend

### Option 2: All-in-One Platform

#### Railway (Full-Stack)

- Deploy entire app to Railway
- Railway supports monorepos with build commands
- Update `railway.json` to build both frontend and backend

#### Render (Full-Stack)

- Similar to Railway but different pricing model
- Good Bun support

## 🗄️ Database Options

### Option 1: Railway PostgreSQL

- Built-in PostgreSQL addon
- Automatic connection string
- Easy to set up

### Option 2: Supabase (You mentioned not using)

- If you change your mind, excellent PostgreSQL hosting
- Built-in auth and real-time features

### Option 3: PlanetScale, Neon, or Vercel Postgres

- Serverless PostgreSQL options
- Good for scaling

## 🔧 Quick Setup Commands

### For Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### For Database Migration

```bash
# Run migrations on production database
DATABASE_URL="your_production_db_url" bunx prisma migrate deploy
```

## 🌐 Expected URLs After Deployment

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`
- API: `https://your-app.railway.app/api`

## 📝 Notes

- Vercel doesn't support Bun runtime natively (yet)
- Railway and Render have excellent Bun support
- Keep environment variables secure and use different values for production
