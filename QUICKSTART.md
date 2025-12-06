# Flare Autopilot - Quick Start Guide

## ✅ Project is Ready!

All contracts compiled successfully and tests are passing. Here's what you have:

## 📦 What's Built

### Smart Contracts (5 contracts)
1. **AutomationHub.sol** - Main automation contract
2. **FTSOPriceTrigger.sol** - FTSO price-based triggers
3. **FDCEventTrigger.sol** - FDC event-based triggers  
4. **SmartAccountExecutor.sol** - Gasless execution via Smart Accounts
5. **FAssetsIntegration.sol** - FAssets operations

### Monitoring Bots (2 bots)
1. **price-monitor.js** - Monitors FTSO prices and triggers strategies
2. **fdc-monitor.js** - Monitors real-world events via FDC

### Frontend
- **frontend/index.html** - Beautiful UI with demo strategies

### Tests
- **test/AutomationHub.test.js** - 7 passing tests ✅

## 🚀 Next Steps for Your Team

### Hour 0-2: Setup (Everyone)
```bash
# Each person clones and sets up
git clone <your-repo>
cd flare-autopilot
npm install
npx hardhat compile
npx hardhat test
```

### Hour 2-6: Development

**Person 1: Smart Contracts**
- Add DEX integration for swaps
- Implement composite triggers
- Write more tests
- Deploy to Coston2

**Person 2: FDC Integration**
- Set up GitHub API integration in `bot/fdc-monitor.js`
- Add weather API integration
- Test event verification
- Get API keys (GitHub, OpenWeatherMap)

**Person 3: FTSO + Smart Accounts**
- Test FTSO price feeds on Coston2
- Implement proper Smart Account integration
- Create price monitoring bot
- Test gasless execution

**Person 4: Frontend + Demo**
- Connect frontend to MetaMask
- Display real contract data
- Create demo video
- Prepare pitch deck

### Hour 6-10: Integration & Testing
- Deploy all contracts to Coston2
- Connect bots to deployed contracts
- Connect frontend to contracts
- End-to-end testing

### Hour 10-14: Polish & Demo
- Fix bugs
- Create demo video
- Practice pitch
- Submit project

## 🔑 Important Addresses (Coston2 Testnet)

```javascript
// FTSO Registry
const FTSO_REGISTRY = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";

// Coston2 RPC
const RPC_URL = "https://coston2-api.flare.network/ext/C/rpc";

// Faucet
// https://faucet.flare.network/
```

## 📝 Deployment Commands

```bash
# Get testnet tokens
# Visit: https://faucet.flare.network/

# Set up environment
cp .env.example .env
# Add your PRIVATE_KEY to .env

# Deploy to Coston2
npx hardhat run scripts/deploy.js --network coston2

# Verify contracts (optional)
npx hardhat verify --network coston2 <CONTRACT_ADDRESS>
```

## 🤖 Running Bots

```bash
cd bot
npm install

# Set environment variables
export EXECUTOR_PRIVATE_KEY=your_key
export GITHUB_TOKEN=your_github_token
export WEATHER_API_KEY=your_weather_key

# Run price monitor
node price-monitor.js

# Run FDC monitor
node fdc-monitor.js
```

## 🎯 Demo Scenarios

### 1. DCA Bot
"When BTC price < $50,000, buy $100 of FAssets-BTC"
- Shows: FTSO + FAssets + Smart Accounts

### 2. GitHub Rewards
"When repo hits 1,000 stars, send 100 FLR to contributors"
- Shows: FDC + Smart Accounts

### 3. Weather Insurance
"When it rains in Mumbai, payout 1,000 USDC"
- Shows: FDC + Smart Accounts

## 📚 Key Files to Read

1. **TEAM_GUIDE.md** - Complete 14-hour timeline
2. **ARCHITECTURE.md** - System design
3. **DEMO.md** - Presentation guide
4. **README.md** - Project overview

## 🐛 Troubleshooting

### Compilation Issues
```bash
# Clean and recompile
npx hardhat clean
npx hardhat compile
```

### Test Failures
```bash
# Run specific test
npx hardhat test test/AutomationHub.test.js
```

### Deployment Issues
- Make sure you have testnet FLR from faucet
- Check your PRIVATE_KEY in .env
- Verify RPC URL is correct

## 🏆 Winning Strategy

Focus on:
1. **Working demo** - Judges need to see it work
2. **All 4 technologies** - Smart Accounts, FDC, FTSO, FAssets
3. **Clear value prop** - Solves real problems
4. **Good presentation** - Practice your pitch

## 💪 You're Ready!

Everything is set up and working. Now it's time to:
1. Divide tasks among your team
2. Build the missing pieces
3. Test everything
4. Create an amazing demo
5. Win the hackathon! 🚀

Good luck! 🎉
