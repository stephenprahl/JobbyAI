# Deploy JobbyAI Backend to Render

## Step-by-Step Deployment Guide

### 1. Prepare Your Repository

Make sure your repository has these files:

- ✅ `Dockerfile` (created)
- ✅ `render.yaml` (created)
- ✅ `package.json` with your dependencies

### 2. Deploy to Render

#### Option A: Using Render Dashboard (Recommended)

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your JobbyAI repository
5. Configure the service:
   - **Name**: `jobby-ai-backend`
   - **Runtime**: Docker
   - **Build Command**: (leave blank - Docker handles this)
   - **Start Command**: (leave blank - Docker handles this)

#### Option B: Using Render YAML (Automatic)

1. Render will automatically detect the `render.yaml` file
2. This will create the service with the predefined configuration

### 3. Set Environment Variables

In your Render service dashboard, add these environment variables:

**Required:**

```
DATABASE_URL=postgresql://username:password@host:port/database
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_here
```

**Optional (for additional features):**

```
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### 4. Database Setup

#### Option A: Use Render PostgreSQL (Recommended)

1. In Render dashboard, create a new PostgreSQL database
2. Copy the connection string to `DATABASE_URL`

#### Option B: External Database

- Use Supabase, PlanetScale, or any PostgreSQL provider
- Copy their connection string to `DATABASE_URL`

### 5. Run Database Migrations

After deployment, you'll need to run migrations:

1. Go to your Render service shell (available in dashboard)
2. Run: `bunx prisma migrate deploy`

Or set up automatic migrations by adding to your Dockerfile:

```dockerfile
RUN bunx prisma migrate deploy
```

### 6. Update Frontend Configuration

Once deployed, update your Vercel frontend:

1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Add: `VITE_API_BASE_URL=https://your-render-app.onrender.com/api`
3. Redeploy your frontend

### 7. Test Your Deployment

Your backend will be available at:

- **Base URL**: `https://your-app-name.onrender.com`
- **API Base**: `https://your-app-name.onrender.com/api`
- **Health Check**: `https://your-app-name.onrender.com/api/health` (if you have one)

## Troubleshooting

### Common Issues

1. **Build fails**: Check that all dependencies are in `package.json`
2. **Database connection fails**: Verify `DATABASE_URL` is correct
3. **App crashes**: Check logs in Render dashboard
4. **CORS errors**: Set `CORS_ORIGIN` to your frontend URL

### Checking Logs

1. Go to Render dashboard
2. Select your service
3. Click "Logs" to see real-time application logs

## Cost Optimization

- Render free tier: 750 hours/month (good for testing)
- For production: Consider paid plans for better performance
- PostgreSQL: Free tier includes 1GB storage

## Next Steps After Deployment

1. ✅ Backend deployed to Render
2. ✅ Update Vercel frontend to point to Render backend
3. ✅ Test all API endpoints
4. ✅ Set up monitoring and alerts
5. ✅ Configure custom domain (optional)
