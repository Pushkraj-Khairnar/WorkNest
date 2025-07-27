#!/bin/bash

echo "🚀 WorkNest Deployment Script"
echo "================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit"
fi

echo "📦 Building frontend..."
cd client
npm install
npm run build
cd ..

echo "📦 Building backend..."
cd backend
npm install
npm run build
cd ..

echo "✅ Build complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create MongoDB Atlas database"
echo "2. Deploy backend to Railway/Render"
echo "3. Deploy frontend to Vercel/Netlify"
echo "4. Update environment variables"
echo "5. Set up Google OAuth"
echo ""
echo "🌐 Don't forget to update:"
echo "- backend/.env.production with your database URI"
echo "- client/.env.production with your backend URL"
