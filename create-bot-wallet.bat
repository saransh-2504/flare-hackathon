@echo off
echo ========================================
echo CREATE BOT WALLET
echo ========================================
echo.
echo Creating new wallet for bot...
echo.

node -e "const ethers = require('ethers'); const wallet = ethers.Wallet.createRandom(); console.log(''); console.log('Bot Wallet Created!'); console.log('=================='); console.log(''); console.log('Address:', wallet.address); console.log(''); console.log('Private Key:', wallet.privateKey); console.log(''); console.log('IMPORTANT:'); console.log('1. Save this private key securely'); console.log('2. Send 5 C2FLR to this address'); console.log('3. Add private key to bot/.env file'); console.log('');"

echo.
pause
