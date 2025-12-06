# 🚀 DEPLOY NOW - Quick Guide

## ✅ Pre-Deployment Verification

Run this to verify everything is ready:
```bash
node verify-deployment.js
```

**Status: ✅ ALL CHECKS PASSED (10/10)**

---

## 📦 Step 1: Push to GitHub

### Option A: New Repository
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Flare Autopilot - Ready for deployment"

# Create repo on GitHub, then:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/flare-autopilot.git
git push -u origin main
```

### Option B: Existing Repository
```bash
git add .
git commit -m "Vercel deployment ready"
git push
```

---

## 🌐 Step 2: Deploy to Vercel

### Method 1: Vercel Dashboard (EASIEST)

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository
4. Vercel auto-detects settings ✅
5. Click "Deploy"
6. Wait 2-3 minutes
7. Get your URL: `https://flare-autopilot.vercel.app`

### Method 2: Vercel CLI
```bash
# Install CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 🔗 Step 3: Deploy Smart Contracts

### Create .env file
```bash
# Copy example
copy .env.example .env

# Edit .env and add your private key
# PRIVATE_KEY=your_private_key_here
```

### Deploy to Coston2
```bash
npm run deploy:coston2
```

**IMPORTANT: Save the contract addresses!**

Example output:
```
AutomationHub deployed to: 0x1234...
FTSOPriceTrigger deployed to: 0x5678...
FDCEventTrigger deployed to: 0x9abc...
SmartAccountExecutor deployed to: 0xdef0...
FAssetsIntegration deployed to: 0x1111...
SecurityFirewall deployed to: 0x2222...
```

---

## 📝 Step 4: Update Contract Addresses

Edit `frontend/config.js`:

```javascript
CONTRACTS: {
    AUTOMATION_HUB: '0x1234...', // Your deployed address
    FTSO_PRICE_TRIGGER: '0x5678...',
    FDC_EVENT_TRIGGER: '0x9abc...',
    SMART_ACCOUNT_EXECUTOR: '0xdef0...',
    FASSETS_INTEGRATION: '0x1111...',
    SECURITY_FIREWALL: '0x2222...'
}
```

### Push update
```bash
git add frontend/config.js
git commit -m "Update contract addresses"
git push
```

Vercel will auto-deploy! ✅

---

## 🧪 Step 5: Test Deployment

### Test URLs
```bash
# Main app
curl https://your-app.vercel.app

# API health
curl https://your-app.vercel.app/api/health

# API docs
curl https://your-app.vercel.app/api/docs
```

### Test in Browser
1. Open `https://your-app.vercel.app`
2. Click "Connect Wallet"
3. Switch to Coston2 network
4. Create a test strategy
5. Check security monitor
6. Go to "API & Integration" tab
7. Generate API key
8. Test API endpoints

---

## 📊 What You Get

### Deployed Components:
- ✅ **Frontend**: Static site on Vercel CDN
- ✅ **API**: Serverless functions (auto-scaling)
- ✅ **Smart Contracts**: On Flare Coston2
- ✅ **HTTPS**: Free SSL certificate
- ✅ **CI/CD**: Auto-deploy on git push
- ✅ **Global CDN**: Fast worldwide

### URLs:
- **Main App**: `https://flare-autopilot.vercel.app`
- **API Docs**: `https://flare-autopilot.vercel.app/api-docs.html`
- **API Health**: `https://flare-autopilot.vercel.app/api/health`

---

## 🎯 For Hackathon Judges

Share these links:
1. **Live Demo**: `https://your-app.vercel.app`
2. **API Docs**: `https://your-app.vercel.app/api-docs.html`
3. **GitHub**: `https://github.com/YOUR_USERNAME/flare-autopilot`
4. **Contracts**: Check Coston2 Explorer

---

## 🐛 Troubleshooting

### Build Failed?
- Check Vercel logs in dashboard
- Verify `vercel.json` syntax
- Ensure all dependencies in `package.json`

### API Not Working?
- Check function logs in Vercel
- Verify routes in `vercel.json`
- Test `/api/health` endpoint

### Frontend Not Loading?
- Clear browser cache
- Check browser console
- Verify `config.js` loaded

### Wallet Connection Issues?
- Make sure MetaMask installed
- Switch to Coston2 network
- Check contract addresses updated

---

## ⏱️ Time Estimate

- **GitHub Push**: 2 minutes
- **Vercel Deploy**: 3 minutes
- **Contract Deploy**: 5 minutes
- **Update & Test**: 5 minutes

**Total: ~15 minutes** ⚡

---

## 🎉 Success Checklist

- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Contracts deployed to Coston2
- [ ] Contract addresses updated
- [ ] Frontend loads correctly
- [ ] Wallet connects successfully
- [ ] Can create strategies
- [ ] Security monitor works
- [ ] API endpoints respond
- [ ] API key generation works

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Flare Docs**: https://docs.flare.network
- **Check**: `VERCEL_DEPLOYMENT.md` for detailed guide

---

## 🚀 READY TO DEPLOY!

Run verification one more time:
```bash
node verify-deployment.js
```

Then follow steps 1-5 above!

**Your project is production-ready! 🎉**
