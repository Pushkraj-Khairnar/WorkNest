# 🚀 WorkNest Deployment Guide

## Overview
This guide will help you deploy WorkNest with:
- **Backend**: Render (Node.js/Express API)
- **Frontend**: Vercel (React/Vite SPA)
- **Database**: MongoDB Atlas (Free tier)

## Prerequisites
1. GitHub account
2. MongoDB Atlas account
3. Google Cloud Console account (for OAuth)
4. Render account
5. Vercel account

---

## Step 1: Setup MongoDB Atlas Database

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project called "WorkNest"

### 1.2 Create Database Cluster
1. Click "Create a Cluster"
2. Choose "M0 Sandbox" (Free tier)
3. Select a cloud provider and region close to you
4. Name your cluster: `worknest-cluster`
5. Click "Create Cluster"

### 1.3 Configure Database Access
1. Go to "Database Access" → "Add New Database User"
2. Create a user with username/password authentication
3. Username: `worknest_user`
4. Password: Generate a secure password (save it!)
5. Built-in Role: "Read and write to any database"

### 1.4 Configure Network Access
1. Go to "Network Access" → "Add IP Address"
2. Click "Allow Access from Anywhere" (0.0.0.0/0)
3. Or add specific IPs if you prefer

### 1.5 Get Connection String
1. Go to "Clusters" → "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Save this connection string for later

---

## Step 2: Setup Google OAuth

### 2.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Name: "WorkNest OAuth"

### 2.2 Enable APIs
1. Go to "APIs & Services" → "Library"
2. Search for "Google+ API" and enable it
3. Search for "Google Identity" and enable it

### 2.3 Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in application details:
   - App name: "WorkNest"
   - User support email: your email
   - Developer contact: your email
4. Add scopes: `email`, `profile`, `openid`
5. Save and continue

### 2.4 Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Application type: "Web application"
4. Name: "WorkNest OAuth Client"
5. Authorized redirect URIs (add both):
   - `http://localhost:8000/api/auth/google/callback` (for development)
   - `https://YOUR_RENDER_URL.onrender.com/api/auth/google/callback` (for production)
6. Save your Client ID and Client Secret

---

## Step 3: Deploy Backend to Render

### 3.1 Prepare Your Repository
1. Make sure your code is pushed to GitHub
2. Ensure the backend has the health check endpoint (already added)

### 3.2 Create Render Account
1. Go to [Render](https://render.com/)
2. Sign up with your GitHub account

### 3.3 Deploy Backend Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure service:
   - **Name**: `worknest-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### 3.4 Configure Environment Variables
Add these environment variables in Render dashboard:

```bash
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://worknest_user:<password>@worknest-cluster.mongodb.net/worknest_production
SESSION_SECRET=your_super_secure_session_secret_here_32_chars_minimum
SESSION_EXPIRES_IN=1d
GOOGLE_CLIENT_ID=your_google_client_id_from_step_2
GOOGLE_CLIENT_SECRET=your_google_client_secret_from_step_2
GOOGLE_CALLBACK_URL=https://YOUR_RENDER_URL.onrender.com/api/auth/google/callback
FRONTEND_ORIGIN=https://YOUR_VERCEL_URL.vercel.app
FRONTEND_GOOGLE_CALLBACK_URL=https://YOUR_VERCEL_URL.vercel.app/google/callback
```

**Important**: Replace placeholders with actual values:
- `<password>`: Your MongoDB password
- `YOUR_RENDER_URL`: Your actual Render URL (you'll get this after deployment)
- `YOUR_VERCEL_URL`: Your actual Vercel URL (you'll get this in next step)

### 3.5 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your Render URL: `https://YOUR_APP_NAME.onrender.com`

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Update Frontend Environment
1. Update `client/.env.production` with your actual Render backend URL:

```bash
VITE_API_BASE_URL=https://YOUR_RENDER_URL.onrender.com/api
```

### 4.2 Create Vercel Account
1. Go to [Vercel](https://vercel.com/)
2. Sign up with your GitHub account

### 4.3 Deploy Frontend
1. Click "New Project"
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 4.4 Configure Environment Variables
In Vercel project settings, add:
```bash
VITE_API_BASE_URL=https://YOUR_RENDER_URL.onrender.com/api
```

### 4.5 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Note your Vercel URL: `https://YOUR_PROJECT_NAME.vercel.app`

---

## Step 5: Update OAuth Redirect URLs

### 5.1 Update Google OAuth Settings
1. Go back to Google Cloud Console
2. Update OAuth credentials with actual URLs:
   - Add: `https://YOUR_RENDER_URL.onrender.com/api/auth/google/callback`
   - Add: `https://YOUR_VERCEL_URL.vercel.app/google/callback`

### 5.2 Update Render Environment Variables
Update these variables in Render with actual URLs:
```bash
GOOGLE_CALLBACK_URL=https://YOUR_RENDER_URL.onrender.com/api/auth/google/callback
FRONTEND_ORIGIN=https://YOUR_VERCEL_URL.vercel.app
FRONTEND_GOOGLE_CALLBACK_URL=https://YOUR_VERCEL_URL.vercel.app/google/callback
```

---

## Step 6: Test Your Deployment

### 6.1 Test Backend
1. Visit: `https://YOUR_RENDER_URL.onrender.com/api/health`
2. Should return: `{"status": "OK", "message": "WorkNest Backend is running"}`

### 6.2 Test Frontend
1. Visit: `https://YOUR_VERCEL_URL.vercel.app`
2. Try logging in with Google OAuth
3. Test creating workspaces, projects, and tasks

### 6.3 Test Database Connection
1. Check Render logs for database connection success
2. Try creating a user account
3. Verify data appears in MongoDB Atlas

---

## Step 7: Production Checklist

### 7.1 Security
- [ ] MongoDB network access is configured properly
- [ ] Strong session secret is set
- [ ] OAuth redirect URLs are production URLs only
- [ ] Environment variables are set in production

### 7.2 Performance
- [ ] Frontend build is optimized
- [ ] Backend is running in production mode
- [ ] Database indexes are created (if needed)

### 7.3 Monitoring
- [ ] Check Render service logs
- [ ] Monitor Vercel function logs
- [ ] Set up MongoDB Atlas monitoring

---

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_ORIGIN` is set correctly in Render
   - Check that frontend URL matches exactly

2. **Database Connection Failed**
   - Verify MongoDB connection string
   - Check network access settings
   - Ensure password is correct

3. **OAuth Not Working**
   - Verify redirect URLs in Google Console
   - Check client ID/secret in environment variables
   - Ensure callback URLs match exactly

4. **Build Failures**
   - Check build logs in Render/Vercel
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

### Support
- Render: Check service logs in dashboard
- Vercel: Check function logs in dashboard
- MongoDB: Check Atlas monitoring
- OAuth: Check Google Cloud Console logs

---

## Cost Estimation (Free Tiers)
- **MongoDB Atlas**: Free (512 MB storage)
- **Render**: Free (750 hours/month)
- **Vercel**: Free (100 GB bandwidth)
- **Google OAuth**: Free

**Total Cost**: $0/month for development and small-scale usage

---

## Next Steps After Deployment
1. Set up custom domain (optional)
2. Configure SSL certificates (handled automatically)
3. Set up monitoring and alerts
4. Plan for scaling when needed
5. Set up CI/CD pipelines
6. Configure backup strategies

Your WorkNest application should now be live and accessible to users worldwide! 🎉
