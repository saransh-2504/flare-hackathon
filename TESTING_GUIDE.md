# 🧪 Complete Testing Guide - Flare Autopilot

## ✅ Pre-Demo Checklist

### 1. Environment Setup
```bash
# Check Node.js installed
node --version  # Should be v16+

# Check npm installed
npm --version

# Check if ports are free
netstat -ano | findstr :8080  # Should be empty or show your server
netstat -ano | findstr :3000  # Should be empty or show your server
```

### 2. Install Dependencies
```bash
# Main project
npm install

# API server
cd api
npm install
cd ..
```

### 3. Compile Contracts
```bash
npx hardhat compile
```
**Expected Output:**
```
✓ Compiled 6 Solidity files successfully
```

### 4. Run Tests
```bash
npx hardhat test
```
**Expected Output:**
```
✓ 7 passing tests
```

---

## 🚀 Start Everything

### Terminal 1: Frontend Server
```bash
http-server frontend -p 8080 -c-1
```
**Expected Output:**
```
Available on:
  http://127.0.0.1:8080
```

### Terminal 2: API Server
```bash
cd api
npm start
```
**Expected Output:**
```
╔═══════════════════════════════════════════╗
║   🚀 Flare Autopilot API Server          ║
║   Port: 3000                              ║
║   Status: Running                         ║
╚═══════════════════════════════════════════╝
```

---

## 🎯 Testing Scenarios for Demo

### Scenario 1: DCA Bot (RECOMMENDED FOR DEMO) ⭐

**Why This One:**
- Easy to understand
- Shows FTSO integration
- Shows FAssets integration
- Shows Smart Accounts
- Shows Security Firewall

**Steps:**
1. Open http://localhost:8080
2. Click "Create Strategy" tab
3. Fill in:
   - **Trigger Type**: Price Movement (FTSO)
   - **Asset**: BTC
   - **Condition**: < 50000
   - **Action**: Mint FAssets
   - **Amount**: 100
   - **Safety Vault**: 0x742d35Cc6634C0532925a3b844Bc9e7595f4a8f (example)
   - **Enable Protection**: ✅ Checked

4. Click "Create Protected Strategy"

**Expected Result:**
- ✅ Success notification appears
- ✅ Strategy appears in "My Strategies" tab
- ✅ Shows badges: SMART ACCOUNT, FTSO, FASSETS, FIREWALL
- ✅ Stats update (Active: 1, Protected: 1)

**What to Say:**
"This DCA bot monitors Bitcoin price via FTSO. When BTC drops below $50,000, it automatically buys $100 worth of Bitcoin FAssets. All gasless via Smart Accounts. And if any security threat is detected, the firewall automatically pauses it and moves funds to the safety vault."

---

### Scenario 2: GitHub Rewards

**Steps:**
1. Create Strategy:
   - **Trigger Type**: Real-World Event (FDC)
   - **Asset**: flare/autopilot
   - **Condition**: stars > 1000
   - **Action**: Transfer
   - **Amount**: 100
   - **Enable Protection**: ✅ Checked

**What to Say:**
"This uses FDC to verify GitHub API data. When our repo hits 1,000 stars, it automatically sends $100 to contributors. FDC provides cryptographic proof that the event actually happened - no other blockchain can do this!"

---

### Scenario 3: Weather Insurance

**Steps:**
1. Create Strategy:
   - **Trigger Type**: Real-World Event (FDC)
   - **Asset**: Mumbai Weather
   - **Condition**: rain detected
   - **Action**: Transfer
   - **Amount**: 1000
   - **Enable Protection**: ✅ Checked

**What to Say:**
"This is crop insurance. FDC monitors weather APIs. When it rains in Mumbai, farmers automatically get $1,000 payout. No insurance company, no claims process, completely trustless."

---

## 🛡️ Testing Security Features

### Test 1: Circuit Breaker
1. Go to "My Strategies" tab
2. Create a protected strategy
3. Click "Test Circuit Breaker" button in Security Monitor
4. Confirm the dialog

**Expected Result:**
- ✅ Security badge turns RED
- ✅ "CIRCUIT BREAKER ACTIVE" message
- ✅ All protected strategies pause automatically
- ✅ Notification shows "All operations paused"

**What to Say:**
"Watch this - when a threat is detected, the circuit breaker activates instantly. All protected strategies pause automatically. This is real-time security that protects your funds 24/7."

### Test 2: Emergency Transfer
1. Create a protected strategy with safety vault
2. Click "🚨 Emergency" button on the strategy
3. Confirm transfer

**Expected Result:**
- ✅ Notification shows emergency transfer initiated
- ✅ Shows vault address
- ✅ Confirms funds moved to safety

**What to Say:**
"In an emergency, users can instantly move funds to their safety vault. One click, funds are safe."

---

## 🔌 Testing API

### Test 1: Health Check
```bash
curl http://localhost:3000/api/health
```

**Expected Output:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 123.45,
  "timestamp": "2024-12-07T..."
}
```

### Test 2: Get Documentation
```bash
curl http://localhost:3000/api/docs
```

**Expected Output:**
```json
{
  "name": "Flare Autopilot API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

### Test 3: Generate API Key (via Website)
1. Open http://localhost:8080/api-docs.html
2. Fill in email and wallet
3. Click "Generate API Key"

**Expected Result:**
- ✅ API key appears (starts with "flr_")
- ✅ Success notification
- ✅ Copy button works

### Test 4: Use API Key
```bash
# Replace YOUR_API_KEY with generated key
curl http://localhost:3000/api/security/status \
  -H "X-API-Key: YOUR_API_KEY"
```

**Expected Output:**
```json
{
  "success": true,
  "data": {
    "threatLevel": "SAFE",
    "circuitBreakerActive": false,
    ...
  }
}
```

---

## 🎬 Complete Demo Script (5 Minutes)

### Minute 1: Introduction
**Show:** Main website (http://localhost:8080)
**Say:** "Flare Autopilot - the first secure automation platform on Flare. We use all 4 Flare technologies: Smart Accounts, FDC, FTSO, and FAssets."

### Minute 2: Create Strategy
**Do:** Create DCA Bot (Scenario 1)
**Say:** "Let me create a DCA bot. When Bitcoin drops below $50k, automatically buy $100 of FAssets. Notice the security firewall checkbox - this protects my strategy from exploits."

### Minute 3: Show Security
**Do:** Click "Test Circuit Breaker"
**Say:** "Watch this - when a threat is detected via FDC monitoring of security APIs, the circuit breaker activates instantly. All protected strategies pause. Funds are safe."

### Minute 4: Show API
**Do:** Click "API & Integration" tab
**Say:** "But we're not just an app - we're a platform. Developers can integrate our automation and security into THEIR applications using our RESTful API."

**Do:** Generate API key live
**Say:** "Here's a live API key generation. Now any developer can use our platform."

### Minute 5: Live API Demo
**Do:** Open terminal, run:
```bash
curl http://localhost:3000/api/health
```
**Say:** "Here's a live API call. Production-ready with authentication, rate limiting, full documentation."

**Final Pitch:**
"This creates a platform effect. Every app that integrates us brings more users to Flare. That's exponential growth, not linear. And it's only possible on Flare because we use Smart Accounts for gasless execution, FDC for real-world verification, FTSO for price feeds, and FAssets for cross-chain assets. No other blockchain has all four."

---

## 🐛 Troubleshooting

### Issue: Port 8080 already in use
```bash
# Find process
netstat -ano | findstr :8080

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different port
http-server frontend -p 8081
```

### Issue: Port 3000 already in use
```bash
# Find and kill
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: Strategies not appearing
- Check browser console (F12)
- Clear localStorage: `localStorage.clear()`
- Refresh page (Ctrl + F5)

### Issue: API not responding
- Check if server is running
- Check correct port (3000)
- Check firewall settings

---

## ✅ Pre-Demo Checklist

**30 Minutes Before:**
- [ ] Both servers running
- [ ] Website loads (http://localhost:8080)
- [ ] API docs load (http://localhost:8080/api-docs.html)
- [ ] API responds (curl health check)
- [ ] Can create strategy
- [ ] Can test circuit breaker
- [ ] Can generate API key
- [ ] Browser cache cleared (Ctrl + Shift + Delete)

**5 Minutes Before:**
- [ ] Close unnecessary tabs
- [ ] Close unnecessary applications
- [ ] Terminal ready with curl command
- [ ] Website open on main tab
- [ ] API docs open on second tab
- [ ] Zoom/screen share tested

**During Demo:**
- [ ] Speak clearly and confidently
- [ ] Show, don't just tell
- [ ] Highlight unique Flare features
- [ ] Emphasize platform approach
- [ ] End with strong pitch

---

## 🎯 Key Metrics to Mention

- **6** Smart Contracts
- **3** Monitoring Bots
- **15+** API Endpoints
- **4/4** Flare Technologies
- **100%** Gasless (Smart Accounts)
- **$0** Gas Fees
- **24/7** Security Monitoring
- **Real-time** Threat Detection

---

## 💡 Backup Plans

### If Website Doesn't Load:
- Have screenshots ready
- Show code in IDE
- Explain architecture

### If API Doesn't Work:
- Show API documentation
- Show code examples
- Explain endpoints

### If Demo Crashes:
- Stay calm
- Show documentation
- Explain what WOULD happen
- Show smart contracts

---

## 🏆 Winning Phrases

1. "Only possible on Flare - no other blockchain has all 4 technologies"
2. "Not just an app - it's a platform"
3. "Every integration brings more users to Flare"
4. "Real-time security that protects 24/7"
5. "Gasless execution via Smart Accounts"
6. "FDC verifies real-world events trustlessly"
7. "Production-ready, can deploy today"
8. "B2C and B2B revenue streams"

---

## 📊 Success Criteria

### Must Work:
✅ Website loads
✅ Can create strategy
✅ Strategy appears in list
✅ Security monitor shows status
✅ API health check responds

### Nice to Have:
✅ Circuit breaker demo
✅ API key generation
✅ Live API call
✅ Multiple strategies

### Bonus Points:
✅ Smooth animations
✅ No errors in console
✅ Fast response times
✅ Professional presentation

---

**You're ready! Go win that hackathon! 🚀🏆**
