# Flare Autopilot - Demo Guide

## 🎯 Demo Scenarios for Hackathon

### Scenario 1: DCA Bot (Dollar Cost Averaging)
**Use Case**: Automatically buy BTC FAssets when price drops

**Setup**:
1. User creates strategy: "When BTC price < $50,000, buy $100 of FAssets-BTC"
2. Strategy uses FTSO for price monitoring
3. Execution is gasless via Smart Accounts

**Demo Flow**:
```javascript
// Create DCA strategy
const triggerData = encodePriceTrigger("BTC", 50000, false); // below $50k
const actionData = encodeMintFAssets("BTC", 100);

await automationHub.createStrategy(
  TriggerType.PRICE_BELOW,
  ActionType.MINT_FASSETS,
  triggerData,
  actionData,
  0 // unlimited executions
);
```

**What to Show**:
- ✅ FTSO price feed integration
- ✅ FAssets minting automation
- ✅ Smart Account gasless execution
- ✅ Strategy dashboard showing executions

---

### Scenario 2: GitHub Milestone Rewards
**Use Case**: Automatically tip contributors when repo hits 1000 stars

**Setup**:
1. User creates strategy: "When GitHub repo hits 1k stars, send 100 FLR to contributors"
2. FDC verifies GitHub API data
3. Smart contract distributes rewards

**Demo Flow**:
```javascript
// Create GitHub reward strategy
const eventIdentifier = keccak256("github:flare/autopilot:stars");
const triggerData = encodeEventTrigger(EventType.GITHUB_STARS, eventIdentifier, 1000);
const actionData = encodeTransfer(contributorAddress, parseEther("100"));

await automationHub.createStrategy(
  TriggerType.FDC_EVENT,
  ActionType.TRANSFER,
  triggerData,
  actionData,
  1 // execute once
);
```

**What to Show**:
- ✅ FDC real-world event verification
- ✅ Automated reward distribution
- ✅ One-time execution limit
- ✅ Event attestation proof

---

### Scenario 3: Weather-Based Crop Insurance
**Use Case**: Automatically payout insurance when it rains

**Setup**:
1. Farmer creates strategy: "When weather API shows rain in Mumbai, payout 1000 USDC"
2. FDC verifies weather data from API
3. Smart contract releases insurance payout

**Demo Flow**:
```javascript
// Create weather insurance strategy
const eventIdentifier = keccak256("weather:mumbai:rain");
const triggerData = encodeEventTrigger(EventType.WEATHER_DATA, eventIdentifier, 1);
const actionData = encodeTransfer(farmerAddress, parseUnits("1000", 6));

await automationHub.createStrategy(
  TriggerType.FDC_EVENT,
  ActionType.TRANSFER,
  triggerData,
  actionData,
  0
);
```

**What to Show**:
- ✅ FDC API integration
- ✅ Real-world use case (insurance)
- ✅ Trustless payout mechanism
- ✅ No intermediaries needed

---

### Scenario 4: Business Revenue Automation
**Use Case**: Convert Stripe revenue to FAssets automatically

**Setup**:
1. Business creates strategy: "When Stripe revenue hits $10k, convert to BTC FAssets"
2. FDC verifies Stripe API data
3. Automatically mints FAssets

**Demo Flow**:
```javascript
// Create revenue automation strategy
const eventIdentifier = keccak256("stripe:revenue:10000");
const triggerData = encodeEventTrigger(EventType.PAYMENT_RECEIVED, eventIdentifier, 10000);
const actionData = encodeMintFAssets("BTC", 10000);

await automationHub.createStrategy(
  TriggerType.FDC_EVENT,
  ActionType.MINT_FASSETS,
  triggerData,
  actionData,
  0
);
```

**What to Show**:
- ✅ B2B use case
- ✅ Treasury automation
- ✅ FAssets integration
- ✅ Real business value

---

## 🎬 Presentation Flow (5 minutes)

### Slide 1: Problem (30 seconds)
"Flare has powerful Smart Accounts, but no automation layer. Users can't set 'if this, then that' rules."

### Slide 2: Solution (30 seconds)
"Flare Autopilot: Create automated strategies triggered by real-world events, all gasless."

### Slide 3: Tech Stack (30 seconds)
- Smart Accounts: Gasless execution
- FDC: Real-world event verification
- FTSO: Price feeds
- FAssets: Cross-chain assets

### Slide 4: Live Demo (2 minutes)
**Show DCA Bot**:
1. Open dashboard
2. Create strategy: "Buy BTC when price < $50k"
3. Show FTSO price feed
4. Trigger execution
5. Show gasless transaction via Smart Account

### Slide 5: Use Cases (1 minute)
- DCA bots for retail investors
- GitHub rewards for open source
- Insurance automation
- Business treasury management

### Slide 6: Impact on Flare (30 seconds)
- Makes Smart Accounts the killer feature
- Brings new users (non-crypto natives)
- Creates sticky engagement (recurring strategies)
- Showcases all Flare tech working together

---

## 🎨 UI Mockup Features

### Dashboard
- Active strategies count
- Total executions
- Gas saved via Smart Accounts
- Portfolio value

### Strategy Builder (No-Code)
1. **Choose Trigger**:
   - Price movement (FTSO)
   - Real-world event (FDC)
   - Time-based
   - Composite

2. **Set Conditions**:
   - Asset: BTC, ETH, FLR, etc.
   - Threshold: Price or value
   - Frequency: Once, recurring, unlimited

3. **Choose Action**:
   - Buy/Sell FAssets
   - Transfer tokens
   - Mint/Redeem FAssets
   - Custom contract call

4. **Review & Deploy**:
   - Gas estimate: $0 (Smart Account)
   - Expected executions
   - Risk assessment

### Strategy List
- Active/Inactive toggle
- Execution history
- Performance metrics
- Edit/Delete options

---

## 📊 Metrics to Highlight

1. **Gas Savings**: "Users save 100% on gas fees via Smart Accounts"
2. **Execution Speed**: "Strategies execute within 1 block of trigger"
3. **Reliability**: "FDC provides cryptographic proof of events"
4. **Flexibility**: "Support for 100+ assets via FTSO"

---

## 🚀 Quick Start for Judges

```bash
# Clone repo
git clone https://github.com/your-team/flare-autopilot

# Install dependencies
npm install

# Run tests
npx hardhat test

# Deploy to Coston2
npx hardhat run scripts/deploy.js --network coston2

# Start frontend
cd frontend && npm start
```

---

## 💡 Talking Points

1. **Novel**: First automation platform on Flare using Smart Accounts
2. **Complete**: Uses all 4 technologies (Smart Accounts, FDC, FTSO, FAssets)
3. **Practical**: Solves real problems (DCA, insurance, treasury management)
4. **Scalable**: Architecture supports unlimited strategy types
5. **User-Friendly**: No-code interface, gasless execution
6. **Flare-Native**: Showcases Flare's unique advantages

---

## 🎯 Winning Strategy

**Why this wins**:
- ✅ Uses ALL Flare technologies meaningfully
- ✅ Solves real ecosystem gap (no automation layer)
- ✅ Clear path to user adoption
- ✅ B2B and B2C use cases
- ✅ Makes Smart Accounts the killer feature
- ✅ Brings new users to Flare
- ✅ Production-ready architecture
- ✅ Viral potential (everyone needs automation)
