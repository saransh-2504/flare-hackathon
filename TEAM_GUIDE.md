# Flare Autopilot - Team Guide (14 Hours)

## 🎯 Project Overview
Build a Smart Account automation platform that enables gasless, event-driven execution of crypto strategies on Flare.

## 👥 Team Split (4 People)

### Person 1: Smart Contracts Lead (4 hours)
**Tasks**:
1. Review and understand all contracts
2. Add missing functionality:
   - Complete `_executeSwap()` in AutomationHub
   - Add DEX integration for swaps
   - Implement composite triggers
3. Write additional tests
4. Deploy to Coston2 testnet
5. Verify contracts on explorer

**Files to Focus On**:
- `contracts/AutomationHub.sol`
- `contracts/FAssetsIntegration.sol`
- `test/AutomationHub.test.js`

### Person 2: FDC Integration (4 hours)
**Tasks**:
1. Set up FDC attestation verification
2. Create off-chain bot to monitor events:
   - GitHub API integration
   - Weather API integration
   - Generic webhook handler
3. Implement attestation proof generation
4. Test event verification flow

**Files to Create**:
- `bot/fdc-monitor.js`
- `bot/github-integration.js`
- `bot/weather-integration.js`

**Resources**:
- FDC Docs: https://docs.flare.network/tech/state-connector/
- GitHub API: https://docs.github.com/en/rest
- Weather API: OpenWeatherMap

### Person 3: FTSO + Smart Accounts (4 hours)
**Tasks**:
1. Integrate FTSO price feeds properly
2. Test price trigger logic
3. Implement Smart Account integration:
   - EIP-712 signature verification
   - Gasless execution flow
   - Batch operations
4. Create executor bot for price triggers

**Files to Focus On**:
- `contracts/FTSOPriceTrigger.sol`
- `contracts/SmartAccountExecutor.sol`
- `bot/price-monitor.js`

**Resources**:
- FTSO Docs: https://docs.flare.network/tech/ftso/
- Smart Accounts: https://docs.flare.network/tech/smart-accounts/

### Person 4: Frontend + Demo (6 hours)
**Tasks**:
1. Enhance the HTML frontend:
   - Connect to MetaMask
   - Display real contract data
   - Create strategy form that works
   - Show execution history
2. Create demo video/slides
3. Prepare pitch deck
4. Test entire flow end-to-end

**Files to Focus On**:
- `frontend/index.html`
- `frontend/app.js` (create this)
- `DEMO.md`

---

## ⏰ Hour-by-Hour Timeline

### Hours 0-2: Setup & Understanding
**Everyone**:
- Clone repo
- Install dependencies: `npm install`
- Compile contracts: `npx hardhat compile`
- Run tests: `npx hardhat test`
- Read ARCHITECTURE.md and DEMO.md
- Assign specific tasks

### Hours 2-6: Core Development
**Person 1**: Complete smart contracts, write tests
**Person 2**: Build FDC monitoring bot
**Person 3**: Integrate FTSO and Smart Accounts
**Person 4**: Build frontend UI

### Hours 6-10: Integration
**Person 1**: Deploy to Coston2, verify contracts
**Person 2**: Test FDC bot with real APIs
**Person 3**: Test price monitoring and execution
**Person 4**: Connect frontend to contracts

### Hours 10-12: Testing & Polish
**Everyone**: 
- End-to-end testing
- Fix bugs
- Optimize gas
- Polish UI

### Hours 12-13: Demo Preparation
**Person 4**: Create demo video
**Person 1**: Prepare technical walkthrough
**Person 2**: Document FDC integration
**Person 3**: Show FTSO/Smart Account features

### Hour 13-14: Final Review & Submission
**Everyone**:
- Review pitch
- Practice demo
- Submit project
- Prepare for Q&A

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

# Deploy to Coston2 testnet
npx hardhat run scripts/deploy.js --network coston2

# Verify contract
npx hardhat verify --network coston2 CONTRACT_ADDRESS
```

---

## 🔑 Key Integration Points

### 1. FTSO Price Feeds (Coston2)
```solidity
// FTSO Registry: 0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019

interface IFtsoRegistry {
    function getCurrentPriceWithDecimals(string memory _symbol) 
        external view returns (uint256 _price, uint256 _timestamp, uint256 _decimals);
}

// Usage
(uint256 btcPrice, , ) = ftsoRegistry.getCurrentPriceWithDecimals("BTC");
```

### 2. FDC Attestations
```javascript
// Off-chain bot monitors events
const checkGitHubStars = async (repo) => {
  const response = await fetch(`https://api.github.com/repos/${repo}`);
  const data = await response.json();
  return data.stargazers_count;
};

// Generate attestation proof
const attestation = {
  eventType: "GITHUB_STARS",
  value: stars,
  timestamp: Date.now(),
  proof: generateProof(data)
};

// Submit to contract
await fdcEventTrigger.verifyEvent(strategyId, attestation);
```

### 3. Smart Accounts
```javascript
// Gasless execution
const executeGasless = async (strategyId) => {
  const signature = await signTypedData(user, strategyData);
  
  await smartAccountExecutor.executeViaSmartAccount(
    smartAccountAddress,
    automationHubAddress,
    executeStrategyCalldata,
    signature
  );
};
```

### 4. FAssets
```solidity
// Mint FAssets
IFAsset(fAssetBTC).mint(amount);

// Redeem FAssets
IFAsset(fAssetBTC).redeem(amount);
```

---

## 📝 Demo Script

### Opening (30 seconds)
"Hi judges! We're building Flare Autopilot - the first Smart Account automation platform on Flare. Think Zapier for crypto, but gasless and trustless."

### Problem (30 seconds)
"Flare has powerful Smart Accounts, but no automation layer. Users can't set 'if this, then that' rules. They have to manually execute every transaction."

### Solution (1 minute)
"Flare Autopilot lets users create automated strategies triggered by:
- Price movements via FTSO
- Real-world events via FDC
- Time-based schedules

All executed gaslessly via Smart Accounts."

### Demo (2 minutes)
**Show DCA Bot**:
1. "Let me create a DCA strategy: Buy $100 of Bitcoin FAssets when price drops below $50k"
2. [Create strategy in UI]
3. "The bot monitors FTSO price feeds 24/7"
4. [Show price monitoring]
5. "When triggered, it executes via Smart Account - zero gas fees"
6. [Show execution]

**Show GitHub Rewards**:
1. "Here's another: Tip contributors when our repo hits 1000 stars"
2. [Show FDC verification]
3. "FDC verifies the GitHub API data trustlessly"
4. [Show attestation proof]

### Impact (30 seconds)
"This makes Smart Accounts Flare's killer feature. Every automation is a transaction on Flare. We bring new users who want automation, not just DeFi degens."

### Tech Stack (30 seconds)
"We use all 4 Flare technologies:
- Smart Accounts: Gasless execution
- FDC: Real-world event verification
- FTSO: Price feeds for 100+ assets
- FAssets: Cross-chain Bitcoin, XRP, Dogecoin"

### Closing (30 seconds)
"Flare Autopilot turns Flare into the automation layer for all of crypto. Thank you!"

---

## 🎨 UI Priorities

### Must Have:
1. Strategy creation form
2. Strategy list with status
3. Execution history
4. Connect wallet button

### Nice to Have:
1. Real-time price charts
2. Strategy templates
3. Performance analytics
4. Gas savings calculator

### Skip for Hackathon:
1. Mobile responsive
2. Dark mode
3. Advanced animations
4. User profiles

---

## 🐛 Common Issues & Solutions

### Issue: FTSO price feed not working
**Solution**: Make sure you're using Coston2 testnet and correct registry address

### Issue: FDC attestation failing
**Solution**: For hackathon, use simplified verification. Full FDC integration takes time.

### Issue: Smart Account not executing
**Solution**: Ensure Smart Account is registered and has sufficient balance

### Issue: Gas estimation failing
**Solution**: Use hardcoded gas limits for demo

---

## 📚 Resources

### Flare Docs
- Main: https://docs.flare.network/
- FTSO: https://docs.flare.network/tech/ftso/
- FDC: https://docs.flare.network/tech/state-connector/
- Smart Accounts: https://docs.flare.network/tech/smart-accounts/
- FAssets: https://docs.flare.network/tech/fassets/

### Testnet
- Coston2 RPC: https://coston2-api.flare.network/ext/C/rpc
- Faucet: https://faucet.flare.network/
- Explorer: https://coston2-explorer.flare.network/

### APIs
- GitHub: https://docs.github.com/en/rest
- OpenWeatherMap: https://openweathermap.org/api
- Stripe: https://stripe.com/docs/api

---

## 🏆 Winning Criteria

✅ **Technical Excellence**: All 4 Flare technologies integrated
✅ **Innovation**: First automation platform on Flare
✅ **Practicality**: Solves real problems
✅ **Completeness**: Working demo, tests, documentation
✅ **Impact**: Clear path to user adoption
✅ **Presentation**: Clear, compelling demo

---

## 💪 You Got This!

Remember:
- Focus on the demo - judges need to see it working
- Don't over-engineer - MVP is enough
- Test early and often
- Help each other - you're a team
- Have fun! This is a cool project

Good luck! 🚀
