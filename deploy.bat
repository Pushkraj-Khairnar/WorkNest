@echo off
echo 🚀 WorkNest Deployment Script
echo ================================

REM Check if git is initialized
if not exist ".git" (
    echo Initializing git repository...
    git init
    git add .
    git commit -m "Initial commit"
)

echo 📦 Building frontend...
cd client
call npm install
call npm run build
cd ..

echo 📦 Building backend...
cd backend
call npm install
call npm run build
cd ..

echo ✅ Build complete!
echo.
echo 📋 Next steps:
echo 1. Create MongoDB Atlas database
echo 2. Deploy backend to Railway/Render
echo 3. Deploy frontend to Vercel/Netlify
echo 4. Update environment variables
echo 5. Set up Google OAuth
echo.
echo 🌐 Don't forget to update:
echo - backend/.env.production with your database URI
echo - client/.env.production with your backend URL

pause
