@echo off
echo ========================================
echo   GitHub Repository Setup
echo ========================================
echo.

REM Check if git is initialized
if not exist .git (
    echo Initializing Git repository...
    git init
    echo.
)

REM Check if .gitignore exists
if not exist .gitignore (
    echo Creating .gitignore...
    (
        echo node_modules/
        echo .env
        echo .env.local
        echo cache/
        echo artifacts/
        echo coverage/
        echo *.log
        echo .DS_Store
    ) > .gitignore
    echo.
)

echo Adding files to git...
git add .
echo.

echo Committing changes...
git commit -m "Flare Autopilot - Ready for deployment"
echo.

echo ========================================
echo   Next Steps:
echo ========================================
echo.
echo 1. Create a new repository on GitHub:
echo    https://github.com/new
echo.
echo 2. Run these commands (replace YOUR_USERNAME):
echo.
echo    git branch -M main
echo    git remote add origin https://github.com/YOUR_USERNAME/flare-autopilot.git
echo    git push -u origin main
echo.
echo 3. Then deploy to Vercel:
echo    https://vercel.com/new
echo.
echo ========================================

pause
