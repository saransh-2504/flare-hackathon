@echo off
cls
echo ========================================
echo FLARE AUTOPILOT - QUICK START
echo ========================================
echo.
echo This script will help you deploy everything!
echo.
pause

:MENU
cls
echo ========================================
echo FLARE AUTOPILOT - DEPLOYMENT MENU
echo ========================================
echo.
echo 1. Check Prerequisites
echo 2. Install Dependencies
echo 3. Compile Contracts
echo 4. Run Tests
echo 5. Deploy to Coston2
echo 6. Update Frontend Config
echo 7. Create Bot Wallet
echo 8. Start Frontend
echo 9. Start Bot
echo 0. Exit
echo.
set /p choice="Enter your choice (0-9): "

if "%choice%"=="1" goto CHECK
if "%choice%"=="2" goto INSTALL
if "%choice%"=="3" goto COMPILE
if "%choice%"=="4" goto TEST
if "%choice%"=="5" goto DEPLOY
if "%choice%"=="6" goto CONFIG
if "%choice%"=="7" goto WALLET
if "%choice%"=="8" goto FRONTEND
if "%choice%"=="9" goto BOT
if "%choice%"=="0" goto END
goto MENU

:CHECK
cls
echo Checking prerequisites...
echo.
node --version
npm --version
echo.
if not exist .env (
    echo [!] .env file not found!
    echo     Creating from template...
    copy .env.example .env
    echo.
    echo [!] IMPORTANT: Edit .env and add your PRIVATE_KEY
    echo.
)
pause
goto MENU

:INSTALL
cls
echo Installing dependencies...
echo.
call npm install
echo.
cd bot
call npm install
cd ..
echo.
echo [OK] Dependencies installed!
pause
goto MENU

:COMPILE
cls
echo Compiling contracts...
echo.
call npx hardhat compile
echo.
pause
goto MENU

:TEST
cls
echo Running tests...
echo.
call npx hardhat test
echo.
pause
goto MENU

:DEPLOY
cls
echo ========================================
echo DEPLOYING TO COSTON2 TESTNET
echo ========================================
echo.
echo Make sure you have:
echo - Added PRIVATE_KEY to .env
echo - At least 5 C2FLR in your wallet
echo.
pause
echo.
echo Deploying contracts...
echo.
call npx hardhat run scripts/deploy.js --network coston2
echo.
echo ========================================
echo.
echo [!] IMPORTANT: Copy the contract addresses above!
echo     You'll need them in the next step.
echo.
pause
goto MENU

:CONFIG
cls
echo Updating frontend configuration...
echo.
call node scripts/update-config.js
echo.
pause
goto MENU

:WALLET
cls
call create-bot-wallet.bat
goto MENU

:FRONTEND
cls
echo Starting frontend server...
echo.
echo Frontend will be available at: http://localhost:8080
echo.
echo Press Ctrl+C to stop
echo.
call npx http-server public -p 8080
pause
goto MENU

:BOT
cls
echo Starting monitoring bot...
echo.
echo Make sure you have:
echo - Created bot wallet
echo - Funded bot wallet with C2FLR
echo - Updated bot/.env with addresses
echo.
pause
cd bot
call node auto-monitor.js
cd ..
pause
goto MENU

:END
echo.
echo Goodbye!
echo.
exit
