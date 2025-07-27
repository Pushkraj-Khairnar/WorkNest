@echo off
echo =================================
echo  WorkNest Deployment Preparation
echo =================================
echo.

echo 1. Checking if Git is initialized...
if not exist ".git" (
    echo Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit for WorkNest deployment"
) else (
    echo Git repository already exists.
)

echo.
echo 2. Building backend for production...
cd backend
call npm install
call npm run build
if %errorlevel% neq 0 (
    echo Backend build failed! Please check for errors.
    pause
    exit /b 1
)
cd ..

echo.
echo 3. Building frontend for production...
cd client
call npm install
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed! Please check for errors.
    pause
    exit /b 1
)
cd ..

echo.
echo 4. Preparing for Git push...
git add .
git commit -m "Prepare for deployment - added health check and build configs"

echo.
echo =================================
echo  Deployment Preparation Complete!
echo =================================
echo.
echo Next steps:
echo 1. Push your code to GitHub: git push origin main
echo 2. Follow the DEPLOYMENT_GUIDE.md for detailed instructions
echo 3. Set up MongoDB Atlas database
echo 4. Deploy backend to Render
echo 5. Deploy frontend to Vercel
echo.
echo Press any key to continue...
pause > nul
