@echo off
echo ========================================
echo FLARE AUTOPILOT - DEPLOYMENT CHECKLIST
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Node.js not found! Please install Node.js 16+
    pause
    exit /b 1
) else (
    echo [OK] Node.js installed
)

REM Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] npm not found!
    pause
    exit /b 1
) else (
    echo [OK] npm installed
)

REM Check .env file
if not exist .env (
    echo [!] .env file not found
    echo     Creating from .env.example...
    copy .env.example .env
    echo.
    echo [!] IMPORTANT: Edit .env and add your PRIVATE_KEY
    echo.
    pause
) else (
    echo [OK] .env file exists
)

REM Check if dependencies installed
if not exist node_modules (
    echo [!] Dependencies not installed
    echo     Installing now...
    call npm install
) else (
    echo [OK] Dependencies installed
)

echo.
echo ========================================
echo DEPLOYMENT STEPS:
echo ========================================
echo.
echo 1. Get C2FLR tokens from faucet:
echo    https://faucet.flare.network/
echo.
echo 2. Add your private key to .env file
echo.
echo 3. Compile contracts:
echo    npx hardhat compile
echo.
echo 4. Run tests:
echo    npx hardhat test
echo.
echo 5. Deploy to Coston2:
echo    npx hardhat run scripts/deploy.js --network coston2
echo.
echo 6. Update public/config.js with contract addresses
echo.
echo 7. Create bot wallet and fund it
echo.
echo 8. Start frontend:
echo    npx http-server public -p 8080
echo.
echo 9. Start bot:
echo    cd bot ^&^& node auto-monitor.js
echo.
echo ========================================
echo.
pause
