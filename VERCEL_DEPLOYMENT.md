# 🚀 Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **GitHub Account**: Your code should be on GitHub
3. **Vercel CLI** (optional): `npm install -g vercel`

---

## 📦 What's Included

Your project is now Vercel-ready with:
- ✅ `vercel.json` - Vercel configuration
- ✅ `.vercelignore` - Files to exclude
- ✅ `frontend/config.js` - Environment-based config
- ✅ Updated `package.json` - Vercel build scripts
- ✅ Serverless API - Auto-scales

---

## 🚀 Deployment Methods

### Method 1: Deploy via Vercel Dashboard (RECOMMENDED)

#### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Flare Autopilot"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/flare-autopilot.git
git push -u origin main
```

#### Step 2: Import to Vercel
1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository
4. Vercel will auto-detect settings
5. Click "Deploy"

#### Step 3: Configure Environment Variables (Optional)
In Vercel Dashboard → Settings → Environment Variables:
```
NODE_ENV=production
```

---

### Method 2: Deploy via Vercel CLI

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login
```bash
vercel login
```

#### Step 3: Deploy
```bash
# From project root
vercel

# For production
vercel --prod
```

---

## 🔧 Post-Deployment Steps

### 1. Deploy Smart Contracts to Flare Coston2

```bash
# Set up .env file
echo "PRIVATE_KEY=your_private_key_here" > .env

# Deploy contracts
npm run deploy:coston2
```

**Save the deployed contract addresses!**

### 2. Update Contract Addresses

Edit `frontend/config.js`:
```javascript
CONTRACTS: {
    AUTOMATION_HUB: '0xYourDeployedAddress',
    FTSO_PRICE_TRIGGER: '0xYourDeployedAddress',
    FDC_EVENT_TRIGGER: '0xYourDeployedAddress',
    SMART_ACCOUNT_EXECUTOR: '0xYourDeployedAddress',
    FASSETS_INTEGRATION: '0xYourDeployedAddress',
    SECURITY_FIREWALL: '0xYourDeployedAddress'
}
```

### 3. Commit and Redeploy
```bash
git add frontend/config.js
git commit -m "Update contract addresses"
git push
```

Vercel will auto-deploy!

---

## 🌐 Your Deployed URLs

After deployment, you'll get:

- **Main App**: `https://flare-autopilot.vercel.app`
- **API Docs**: `https://flare-autopilot.vercel.app/api-docs.html`
- **API Endpoint**: `https://flare-autopilot.vercel.app/api/health`

---

## 🧪 Testing Deployment

### Test Frontend
```bash
curl https://your-app.vercel.app
```

### Test API
```bash
# Health check
curl https://your-app.vercel.app/api/health

# API docs
curl https://your-app.vercel.app/api/docs
```

### Test in Browser
1. Open `https://your-app.vercel.app`
2. Connect wallet
3. Create a strategy
4. Test circuit breaker
5. Check API tab

---

## 📊 Vercel Features You Get

### Automatic:
- ✅ **HTTPS** - Free SSL certificate
- ✅ **CDN** - Global edge network
- ✅ **Auto-scaling** - Handles traffic spikes
- ✅ **CI/CD** - Auto-deploy on git push
- ✅ **Preview URLs** - For each PR
- ✅ **Analytics** - Built-in monitoring

### Performance:
- ✅ **Serverless Functions** - API scales automatically
- ✅ **Static Optimization** - Frontend cached globally
- ✅ **Edge Network** - Fast worldwide
- ✅ **Compression** - Gzip/Brotli enabled

---

## 🔒 Environment Variables

### Required (None for basic deployment)

### Optional:
```
NODE_ENV=production
PRIVATE_KEY=your_wallet_private_key (for contract deployment)
```

**⚠️ Never commit .env file to git!**

---

## 🐛 Troubleshooting

### Issue: Build Failed
**Solution:**
- Check `vercel.json` syntax
- Ensure all dependencies in `package.json`
- Check build logs in Vercel dashboard

### Issue: API Not Working
**Solution:**
- Check `api/server.js` exports correctly
- Verify routes in `vercel.json`
- Check function logs in Vercel dashboard

### Issue: Frontend Not Loading
**Solution:**
- Check `frontend/` directory structure
- Verify `vercel.json` routes
- Clear browser cache

### Issue: CORS Errors
**Solution:**
- API already has CORS enabled
- Check browser console for details
- Verify API URL in `config.js`

---

## 📈 Monitoring

### Vercel Dashboard:
- **Analytics**: View traffic and performance
- **Logs**: Check function execution logs
- **Deployments**: See deployment history
- **Domains**: Manage custom domains

### Check Logs:
```bash
vercel logs
```

---

## 🎯 Custom Domain (Optional)

### Add Custom Domain:
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Domains
4. Add your domain
5. Update DNS records

Example: `flareautopilot.com`

---

## 🔄 Continuous Deployment

Every time you push to GitHub:
1. Vercel detects the push
2. Runs build automatically
3. Deploys to production
4. Updates your URL

**Preview Deployments:**
- Every PR gets a unique preview URL
- Test before merging to main

---

## 💰 Pricing

### Hobby (Free):
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions
- ✅ Perfect for hackathon!

### Pro ($20/month):
- More bandwidth
- Team collaboration
- Advanced analytics

---

## ✅ Deployment Checklist

**Before Deployment:**
- [ ] Code pushed to GitHub
- [ ] `vercel.json` configured
- [ ] `package.json` updated
- [ ] `.vercelignore` created
- [ ] `frontend/config.js` created

**After Deployment:**
- [ ] Test main URL
- [ ] Test API endpoints
- [ ] Deploy smart contracts
- [ ] Update contract addresses
- [ ] Test wallet connection
- [ ] Test strategy creation
- [ ] Test API key generation

**For Demo:**
- [ ] Share Vercel URL with judges
- [ ] Test on mobile
- [ ] Check all features work
- [ ] Monitor analytics

---

## 🎉 Success!

Your Flare Autopilot is now:
- ✅ Deployed globally
- ✅ Auto-scaling
- ✅ HTTPS enabled
- ✅ CI/CD configured
- ✅ Production-ready

**Share your URL:**
`https://your-app.vercel.app`

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Discord**: https://vercel.com/discord
- **GitHub Issues**: Create issue in your repo

---

## 🚀 Next Steps

1. **Deploy Now**: Follow Method 1 above
2. **Deploy Contracts**: Run `npm run deploy:coston2`
3. **Update Config**: Add contract addresses
4. **Test Everything**: Use the deployed URL
5. **Share with Judges**: Send them the link!

---

**Your project is Vercel-ready! 🎉**

Deploy command: `vercel --prod`
