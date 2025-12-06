@echo off
echo ========================================
echo   FLARE AUTOPILOT - DEMO TEST SCRIPT
echo ========================================
echo.

echo [1/5] Testing Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    pause
    exit /b 1
)
echo ✓ Node.js OK
echo.

echo [2/5] Testing npm installation...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm not found!
    pause
    exit /b 1
)
echo ✓ npm OK
echo.

echo [3/5] Compiling smart contracts...
call npx hardhat compile
if %errorlevel% neq 0 (
    echo ERROR: Compilation failed!
    pause
    exit /b 1
)
echo ✓ Contracts compiled
echo.

echo [4/5] Running tests...
call npx hardhat test
if %errorlevel% neq 0 (
    echo WARNING: Some tests failed
) else (
    echo ✓ All tests passed
)
echo.

echo [5/5] Checking if ports are available...
netstat -ano | findstr :8080 >nul
if %errorlevel% equ 0 (
    echo WARNING: Port 8080 is in use
) else (
    echo ✓ Port 8080 available
)

netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo WARNING: Port 3000 is in use
) else (
    echo ✓ Port 3000 available
)
echo.

echo ========================================
echo   ALL CHECKS COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Start frontend: http-server frontend -p 8080
echo 2. Start API: cd api ^&^& npm start
echo 3. Open: http://localhost:8080
echo.
pause
