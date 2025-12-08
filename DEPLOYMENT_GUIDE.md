# 🚀 Complete Deployment Guide - Flare Autopilot

This guide will help you deploy Flare Autopilot to Coston2 testnet and make it fully functional.

---

## 📋 Prerequisites

Before starting, make sure you have:

- ✅ Node.js >= 16.0.0 installed
- ✅ MetaMask wallet installed
- ✅ Coston2 testnet added to MetaMask
- ✅ C2FLR tokens from faucet (at least 10 C2FLR)

---

## Step 1: Get Coston2 Testnet Tokens

### Add Coston2 to MetaMask

**Network Details:**
- Network Name: `Coston2 Testnet`
- RPC URL: `https://coston2-api.flare.network/ext/C/rpc`
- Chain ID: `114`
- Currency Symbol: `C2FLR`
- Block Explorer: `https://coston2-explorer.flare.network`

### Get Free Tokens

1. Go to: https://faucet.flare.network/
2. Select "Coston2 Testnet"
3. Enter your wallet address
4. Click "Request C2FLR"
5. Wait 30 seconds for tokens to arrive

**You'll need:**
- 5 C2FLR for contract deployment
- 5 C2FLR for bot wallet

---

## Step 2: Configure Environment

### 1. Get Your Private Key

**⚠️ IMPORTANT: Never share your private key!**

From MetaMask:
1. Click on your account
2. Account Details → Export Private Key
3. Enter password
4. Copy private key

### 2. Update .env File

Open `.env` file and add your private key:

```bash
PRIVATE_KEY=your_actual_private_key_here
COSTON2_RPC_URL=https://coston2-api.flare.network/ext/C/rpc
FLARE_RPC_URL=https://flare-api.flare.network/ext/C/rpc
```

---

## Step 3: Deploy Smart Contracts

### 1. Install Dependencies

```bash
npm install
```

### 2. Compile Contracts

```bash
npx hardhat compile
```

Expected output:
```
✓ Compiled 6 Solidity files successfully
```

### 3. Run Tests (Optional but Recommended)

```bash
npx hardhat test
```

Expected output:
```
  7 passing (2s)
```

### 4. Deploy to Coston2

```bash
npx hardhat run scripts/deploy.js --network coston2
```

**Expected output:**
```
🚀 Deploying Flare Autopilot contracts...

Deploying AutomationHub...
✅ AutomationHub deployed to: 0x1234...

Deploying FTSOPriceTrigger...
✅ FTSOPriceTrigger deployed to: 0x5678...

... (more contracts)

🎉 All contracts deployed successfully!
```

### 5. Save Contract Addresses

**IMPORTANT:** Copy all the contract addresses from the output. You'll need them in the next step.

---

## Step 4: Update Frontend Configuration

### 1. Open `public/config.js`

### 2. Update Contract Addresses

Replace the placeholder addresses with your deployed addresses:

```javascript
window.FLARE_CONFIG = {
    NETWORK: 'coston2',
    RPC_URL: 'https://coston2-api.flare.network/ext/C/rpc',
    CHAIN_ID: 114,
    
    // Replace these with your deployed addresses
    AUTOMATION_HUB: '0xYOUR_AUTOMATION_HUB_ADDRESS',
    FTSO_PRICE_TRIGGER: '0xYOUR_FTSO_PRICE_TRIGGER_ADDRESS',
    FDC_EVENT_TRIGGER: '0xYOUR_FDC_EVENT_TRIGGER_ADDRESS',
    SMART_ACCOUNT_EXECUTOR: '0xYOUR_SMART_ACCOUNT_EXECUTOR_ADDRESS',
    FASSETS_INTEGRATION: '0xYOUR_FASSETS_INTEGRATION_ADDRESS',
    
    // Flare system contracts (already correct)
    FTSO_REGISTRY: '0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019',
    
    API_URL: 'http://localhost:3000/api'
};
```

### 3. Save the file

---

## Step 5: Create Bot Wallet

The bot needs its own wallet to execute strategies and pay gas fees.

### 1. Create New Wallet

```bash
# On Windows
create-bot-wallet.bat

# Or manually with Node.js
node -e "const ethers = require('ethers'); const wallet = ethers.Wallet.createRandom(); console.log('Address:', wallet.address); console.log('Private Key:', wallet.privateKey);"
```

### 2. Fund Bot Wallet

Send 5 C2FLR from your main wallet to the bot wallet address.

### 3. Create bot/.env File

Create `bot/.env` with:

```bash
PRIVATE_KEY=bot_wallet_private_key_here
RPC_URL=https://coston2-api.flare.network/ext/C/rpc
AUTOMATION_HUB=0xYOUR_AUTOMATION_HUB_ADDRESS
FTSO_PRICE_TRIGGER=0xYOUR_FTSO_PRICE_TRIGGER_ADDRESS
FTSO_REGISTRY=0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019
```

---

## Step 6: Start the Application

### Terminal 1: Start Frontend

```bash
npx http-server public -p 8080
```

Open browser: http://localhost:8080

### Terminal 2: Start Monitoring Bot

```bash
cd bot
npm install
node auto-monitor.js
```

Expected output:
```
🤖 Flare Autopilot Bot Started
Monitoring blockchain for strategies...
Bot Wallet: 0x...
Balance: 5.0 C2FLR
```

---

## Step 7: Test Everything

### 1. Connect Wallet

1. Open http://localhost:8080
2. Click "Connect Wallet"
3. Approve MetaMask connection
4. You should see your address in the nav bar

### 2. Create a Strategy

1. Fill in the strategy form:
   - Trigger Type: Price Trigger (FTSO)
   - Asset: BTC
   - Condition: Below
   - Target Price: 50000
   - Action: Mint FAssets
   - Amount: 100
   - Enable Security Firewall: ✓

2. Click "Create Strategy"
3. Approve MetaMask transaction
4. Wait for confirmation

### 3. Verify Strategy

1. Check "Active Strategies" card
2. You should see your strategy listed
3. Status should show "Active"

### 4. Monitor Bot

Check Terminal 2 - you should see:
```
👀 Monitoring strategy 1...
Symbol: BTC
Target: < 50000
Current: 43250.00
Status: Waiting for condition
```

### 5. Test Execution

When BTC price meets your condition, the bot will automatically:
1. Detect the trigger
2. Execute the strategy
3. Show transaction hash
4. Update execution count

---

## 🎉 Success!

Your Flare Autopilot is now fully deployed and functional!

### What's Working:

✅ Smart contracts deployed on Coston2
✅ Frontend connected to blockchain
✅ Strategies stored on-chain
✅ Bot monitoring 24/7
✅ Automatic execution when conditions met
✅ Real FTSO price feeds
✅ Gasless transactions via Smart Accounts

---

## 🔧 Troubleshooting

### "Insufficient funds" error

**Solution:** Make sure you have at least 1 C2FLR in your wallet for gas fees.

### "Contract not deployed" error

**Solution:** 
1. Check that you updated `public/config.js` with correct addresses
2. Verify contracts are deployed: https://coston2-explorer.flare.network

### Bot not executing strategies

**Solution:**
1. Check bot wallet has C2FLR balance
2. Verify bot/.env has correct contract addresses
3. Restart bot: `node auto-monitor.js`

### MetaMask transaction fails

**Solution:**
1. Make sure you're on Coston2 network
2. Try increasing gas limit manually
3. Check you have enough C2FLR

---

## 📊 Monitoring

### Check Contract on Explorer

Visit: https://coston2-explorer.flare.network/address/YOUR_CONTRACT_ADDRESS

You can see:
- All transactions
- Strategy creations
- Executions
- Events emitted

### Check Bot Logs

The bot terminal shows:
- Strategies being monitored
- Current prices
- Execution attempts
- Transaction hashes

### Check Frontend

The dashboard shows:
- Active strategies count
- Total value locked
- Execution count
- Security status

---

## 🚀 Next Steps

### Deploy to Mainnet

When ready for production:

1. Get real FLR tokens
2. Update network to `flare` in hardhat.config.js
3. Deploy with: `npx hardhat run scripts/deploy.js --network flare`
4. Update frontend config to mainnet
5. Start bot with mainnet RPC

### Add More Features

- Create more complex strategies
- Add time-based triggers
- Integrate with FDC for events
- Add email notifications
- Create mobile app

---

## 📞 Need Help?

- Check documentation: [README.md](README.md)
- Review architecture: [ARCHITECTURE.md](ARCHITECTURE.md)
- API reference: [API_GUIDE.md](API_GUIDE.md)
- Open issue: https://github.com/saransh-2504/flare-hackathon/issues

---

**🎊 Congratulations! You've successfully deployed Flare Autopilot!**
