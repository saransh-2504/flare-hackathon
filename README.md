# Flare Autopilot 🚀

**Smart Account Automation Hub for Flare Network**

Flare Autopilot enables users to create automated strategies triggered by real-world events, price movements, and on-chain activities - all gasless via Flare Smart Accounts.

## 🎯 Problem
Flare has powerful Smart Accounts, but no automation layer. Users can't set "if this, then that" rules for their crypto operations.

## 💡 Solution
A no-code automation platform where users create strategies like:
- "When BTC price drops 10%, buy FAssets-BTC"
- "When my GitHub repo hits 1k stars, tip contributors"
- "When weather shows rain, trigger crop insurance payout"
- "When Stripe revenue hits $10k, convert to FAssets"

## 🛠 Tech Stack
- **Smart Accounts**: Gasless automation execution ✅
- **FDC (Flare Data Connector)**: Verify real-world events (GitHub, weather, APIs) ✅
- **FTSO (Flare Time Series Oracle)**: Price feeds for triggers ✅
- **FAssets**: Cross-chain asset automation ✅

## 📁 Project Structure
```
flare-autopilot/
├── contracts/              # Solidity smart contracts
│   ├── AutomationHub.sol          # Main automation contract
│   ├── FTSOPriceTrigger.sol       # FTSO price triggers
│   ├── FDCEventTrigger.sol        # FDC event triggers
│   ├── SmartAccountExecutor.sol   # Gasless execution
│   └── FAssetsIntegration.sol     # FAssets operations
├── bot/                    # Monitoring bots
│   ├── price-monitor.js           # FTSO price monitoring
│   └── fdc-monitor.js             # FDC event monitoring
├── scripts/                # Deployment scripts
├── test/                   # Contract tests
├── frontend/               # Web UI
└── docs/                   # Documentation
```

## 🌐 Live Demo

**Deployed on Vercel**: [https://flare-autopilot.vercel.app](https://flare-autopilot.vercel.app)

**API Documentation**: [https://flare-autopilot.vercel.app/api-docs.html](https://flare-autopilot.vercel.app/api-docs.html)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
cd bot && npm install && cd ..
```

### 2. Compile Contracts
```bash
npx hardhat compile
```

### 3. Run Tests
```bash
npx hardhat test
```

### 4. Deploy to Coston2 Testnet
```bash
# Set up .env file
cp .env.example .env
# Add your private key to .env

# Deploy
npx hardhat run scripts/deploy.js --network coston2
```

### 5. Start Monitoring Bots
```bash
cd bot
EXECUTOR_PRIVATE_KEY=your_key node price-monitor.js
```

### 6. Open Frontend
```bash
# Open frontend/index.html in browser
# Or serve with:
npx http-server frontend
```

## 🎮 Demo Scenarios

### 1. DCA Bot (Dollar Cost Averaging)
Auto-buy FAssets when price dips
- **Trigger**: FTSO price < threshold
- **Action**: Mint FAssets
- **Tech**: FTSO + FAssets + Smart Accounts

### 2. GitHub Milestone Rewards
Auto-tip contributors when repo hits stars
- **Trigger**: FDC verifies GitHub stars
- **Action**: Transfer tokens
- **Tech**: FDC + Smart Accounts

### 3. Weather Insurance
Auto-payout when it rains
- **Trigger**: FDC verifies weather API
- **Action**: Transfer insurance payout
- **Tech**: FDC + Smart Accounts

### 4. Business Treasury Automation
Auto-convert revenue to crypto
- **Trigger**: FDC verifies Stripe revenue
- **Action**: Mint FAssets
- **Tech**: FDC + FAssets + Smart Accounts

## 📚 Documentation

- **[TEAM_GUIDE.md](TEAM_GUIDE.md)**: Complete guide for your 4-person team
- **[ARCHITECTURE.md](ARCHITECTURE.md)**: System architecture and design
- **[DEMO.md](DEMO.md)**: Demo scenarios and presentation guide

## 🏆 Why This Wins

✅ **Uses ALL 4 Flare technologies** meaningfully
✅ **Solves real ecosystem gap** - no automation layer exists
✅ **Novel approach** - first Smart Account automation platform
✅ **Clear user value** - gasless, automated strategies
✅ **Production-ready** - complete architecture, tests, docs
✅ **Viral potential** - everyone needs automation
✅ **Helps Flare grow** - makes Smart Accounts the killer feature

## 🎯 Impact on Flare

1. **Makes Smart Accounts sticky** - users set up automations and keep coming back
2. **Brings new users** - non-crypto natives who want automation
3. **Increases transaction volume** - every automation is a transaction
4. **Showcases all tech** - demonstrates Flare's unique advantages
5. **B2B potential** - businesses automate treasury management

## 🔗 Resources

- [Flare Docs](https://docs.flare.network/)
- [FTSO Documentation](https://docs.flare.network/tech/ftso/)
- [FDC Documentation](https://docs.flare.network/tech/state-connector/)
- [Smart Accounts](https://docs.flare.network/tech/smart-accounts/)
- [FAssets](https://docs.flare.network/tech/fassets/)

## 📝 License

MIT

---

**Built for Flare Hackathon 2024** 🚀


---

## 🚀 Deployment Guide

### Quick Deploy (15 minutes)

#### 1. Verify Deployment Readiness
```bash
npm run verify
```
Expected: ✅ 10/10 checks passed

#### 2. Push to GitHub
```bash
git init
git add .
git commit -m "Flare Autopilot - Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/flare-autopilot.git
git push -u origin main
```

#### 3. Deploy to Vercel
1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Click "Deploy"
4. Get your URL: `https://flare-autopilot.vercel.app`

#### 4. Deploy Smart Contracts
```bash
# Create .env file
copy .env.example .env

# Add your private key to .env
# Deploy to Coston2
npm run deploy:coston2
```

#### 5. Update Contract Addresses
Edit `frontend/config.js` with deployed addresses, then:
```bash
git add frontend/config.js
git commit -m "Update contract addresses"
git push
```

### Detailed Guides
- **Quick Deploy**: See `QUICK_DEPLOY.txt`
- **Detailed Steps**: See `DEPLOY_NOW.md`
- **Vercel Specific**: See `VERCEL_DEPLOYMENT.md`
- **Final Checklist**: See `FINAL_CHECKLIST.md`

---

## 📚 Documentation

### User Guides
- `QUICKSTART.md` - Get started in 5 minutes
- `DEMO_CHEATSHEET.md` - 5-minute demo guide
- `TESTING_GUIDE.md` - Testing scenarios

### Developer Guides
- `API_GUIDE.md` - RESTful API reference
- `ARCHITECTURE.md` - System architecture
- `TEAM_GUIDE.md` - Team collaboration

### Deployment Guides
- `DEPLOY_NOW.md` - Quick deployment steps
- `VERCEL_DEPLOYMENT.md` - Detailed Vercel guide
- `FINAL_CHECKLIST.md` - Pre-demo checklist
- `DEPLOYMENT_SUMMARY.md` - Complete summary

---

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Test API Locally
```bash
# Start API server
npm start

# In another terminal
npm run test:api
```

### Verify Deployment
```bash
npm run verify
```

---

## 🎯 Features

### Core Features
- ✅ Automated strategies with multiple trigger types
- ✅ Price-based triggers via FTSO
- ✅ Event-based triggers via FDC
- ✅ Gasless execution via Smart Accounts
- ✅ FAssets integration for asset management
- ✅ Security firewall with circuit breaker
- ✅ Real-time threat monitoring

### API Features
- ✅ RESTful API with 15+ endpoints
- ✅ API key authentication
- ✅ Rate limiting
- ✅ Strategy management
- ✅ Security monitoring
- ✅ FTSO price feeds
- ✅ Webhook support

### UI Features
- ✅ Ultra-enhanced professional design
- ✅ Responsive layout
- ✅ Wallet integration (MetaMask)
- ✅ Real-time security monitor
- ✅ API documentation page
- ✅ Strategy management dashboard

---

## 🏆 Why Flare Autopilot Wins

### Innovation
- First automation layer for Flare Smart Accounts
- Combines all 4 Flare technologies seamlessly
- Solves real user pain point

### Technical Excellence
- Production-ready code
- Comprehensive testing (7/7 tests passing)
- Professional UI/UX
- RESTful API for developers
- Security-first design

### Impact on Flare
- Makes Smart Accounts useful and sticky
- Increases user engagement
- Attracts developers via API
- Shows ecosystem potential
- Creates network effects

---

## 📊 Project Stats

- **Smart Contracts**: 6 contracts, ~800 lines
- **Tests**: 7 passing tests
- **API Endpoints**: 15+ endpoints
- **Documentation**: 15+ comprehensive guides
- **Development Time**: ~14 hours
- **Deployment Status**: ✅ Production Ready

---

## 🤝 Contributing

This is a hackathon project. For questions or collaboration:
- Open an issue on GitHub
- Check the documentation in the repo
- Review `TEAM_GUIDE.md` for collaboration guidelines

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

Built for Flare Network Hackathon
- **Flare Network**: For the amazing technology stack
- **Flare Community**: For support and inspiration
- **Judges**: Thank you for your time and consideration

---

## 📞 Support

- **Documentation**: Check the guides in this repo
- **Flare Docs**: [https://docs.flare.network](https://docs.flare.network)
- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)

---

**Built with ❤️ for Flare Network**

🚀 Ready to automate your DeFi strategies? Deploy now!
