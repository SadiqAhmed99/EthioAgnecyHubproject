@echo off
REM Ethio Agency Hub - Deployment Script for Windows
REM This script helps deploy the application to Vercel

echo 🚀 Ethio Agency Hub - Deployment Script
echo ========================================

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

REM Check if user is logged in to Vercel
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please login to Vercel:
    vercel login
)

REM Check environment variables
echo 🔍 Checking environment variables...
if exist ".env" (
    echo ✅ .env file found
) else (
    echo ⚠️  .env file not found. Please create one from env.example
    echo    copy env.example .env
    echo    Then edit .env with your configuration
    pause
    exit /b 1
)

REM Build the application
echo 🔨 Building application...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful
) else (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
echo Choose deployment type:
echo 1) Preview deployment (for testing)
echo 2) Production deployment
set /p choice="Enter choice (1 or 2): "

if "%choice%"=="1" (
    echo 🚀 Deploying preview...
    vercel
) else if "%choice%"=="2" (
    echo 🚀 Deploying to production...
    vercel --prod
) else (
    echo ❌ Invalid choice. Exiting.
    pause
    exit /b 1
)

echo 🎉 Deployment complete!
echo Check your Vercel dashboard for the deployment URL.
pause
