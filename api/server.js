/**
 * Flare Autopilot API Server
 * RESTful API for automation and security services
 */

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { ethers } = require('ethers');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (in production, use database)
const apiKeys = new Map();
const strategies = new Map();
const securityAlerts = [];

// Generate API Key
function generateApiKey() {
    return 'flr_' + crypto.randomBytes(32).toString('hex');
}

// Middleware: Verify API Key
function verifyApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
        return res.status(401).json({ error: 'API key required' });
    }
    
    const keyData = apiKeys.get(apiKey);
    if (!keyData) {
        return res.status(401).json({ error: 'Invalid API key' });
    }
    
    // Update usage
    keyData.requests++;
    keyData.lastUsed = new Date().toISOString();
    
    req.apiKeyData = keyData;
    next();
}

// ============================================
// PUBLIC ENDPOINTS (No API Key Required)
// ============================================

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        version: '1.0.0',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Get API Documentation
app.get('/api/docs', (req, res) => {
    res.json({
        name: 'Flare Autopilot API',
        version: '1.0.0',
        description: 'Secure automation and security monitoring API for Flare Network',
        endpoints: {
            auth: {
                'POST /api/auth/register': 'Register and get API key',
                'GET /api/auth/key': 'Get your API key info'
            },
            strategies: {
                'POST /api/strategies': 'Create automation strategy',
                'GET /api/strategies': 'List your strategies',
                'GET /api/strategies/:id': 'Get strategy details',
                'DELETE /api/strategies/:id': 'Delete strategy'
            },
            security: {
                'GET /api/security/status': 'Get security status',
                'GET /api/security/threats': 'Get threat alerts',
                'POST /api/security/check': 'Check address security'
            },
            ftso: {
                'GET /api/ftso/price/:symbol': 'Get asset price',
                'GET /api/ftso/prices': 'Get multiple prices'
            }
        },
        authentication: 'Include X-API-Key header in all requests'
    });
});

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

// Register and get API key
app.post('/api/auth/register', (req, res) => {
    const { email, walletAddress, name } = req.body;
    
    if (!email || !walletAddress) {
        return res.status(400).json({ error: 'Email and wallet address required' });
    }
    
    const apiKey = generateApiKey();
    
    apiKeys.set(apiKey, {
        apiKey,
        email,
        walletAddress,
        name: name || 'Anonymous',
        createdAt: new Date().toISOString(),
        requests: 0,
        lastUsed: null,
        tier: 'free', // free, pro, enterprise
        rateLimit: 100 // requests per hour
    });
    
    res.json({
        success: true,
        apiKey,
        message: 'API key generated successfully',
        tier: 'free',
        rateLimit: 100
    });
});

// Get API key info
app.get('/api/auth/key', verifyApiKey, (req, res) => {
    const { apiKey, ...keyData } = req.apiKeyData;
    res.json({
        success: true,
        data: keyData
    });
});

// ============================================
// STRATEGY ENDPOINTS
// ============================================

// Create strategy
app.post('/api/strategies', verifyApiKey, (req, res) => {
    const { triggerType, asset, condition, action, amount, protected } = req.body;
    
    if (!triggerType || !asset || !condition || !action || !amount) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const strategyId = crypto.randomBytes(16).toString('hex');
    const strategy = {
        id: strategyId,
        owner: req.apiKeyData.walletAddress,
        triggerType,
        asset,
        condition,
        action,
        amount,
        protected: protected || false,
        active: true,
        executions: 0,
        createdAt: new Date().toISOString()
    };
    
    strategies.set(strategyId, strategy);
    
    res.json({
        success: true,
        data: strategy,
        message: 'Strategy created successfully'
    });
});

// List strategies
app.get('/api/strategies', verifyApiKey, (req, res) => {
    const userStrategies = Array.from(strategies.values())
        .filter(s => s.owner === req.apiKeyData.walletAddress);
    
    res.json({
        success: true,
        count: userStrategies.length,
        data: userStrategies
    });
});

// Get strategy by ID
app.get('/api/strategies/:id', verifyApiKey, (req, res) => {
    const strategy = strategies.get(req.params.id);
    
    if (!strategy) {
        return res.status(404).json({ error: 'Strategy not found' });
    }
    
    if (strategy.owner !== req.apiKeyData.walletAddress) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json({
        success: true,
        data: strategy
    });
});

// Delete strategy
app.delete('/api/strategies/:id', verifyApiKey, (req, res) => {
    const strategy = strategies.get(req.params.id);
    
    if (!strategy) {
        return res.status(404).json({ error: 'Strategy not found' });
    }
    
    if (strategy.owner !== req.apiKeyData.walletAddress) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    strategies.delete(req.params.id);
    
    res.json({
        success: true,
        message: 'Strategy deleted successfully'
    });
});

// ============================================
// SECURITY ENDPOINTS
// ============================================

// Get security status
app.get('/api/security/status', verifyApiKey, (req, res) => {
    res.json({
        success: true,
        data: {
            threatLevel: 'SAFE',
            circuitBreakerActive: false,
            threatsDetected: securityAlerts.length,
            lastCheck: new Date().toISOString(),
            sources: {
                certik: { status: 'operational', lastUpdate: new Date().toISOString() },
                peckshield: { status: 'operational', lastUpdate: new Date().toISOString() },
                ftso: { status: 'operational', lastUpdate: new Date().toISOString() },
                fdc: { status: 'operational', lastUpdate: new Date().toISOString() }
            }
        }
    });
});

// Get threat alerts
app.get('/api/security/threats', verifyApiKey, (req, res) => {
    res.json({
        success: true,
        count: securityAlerts.length,
        data: securityAlerts.slice(-10) // Last 10 alerts
    });
});

// Check address security
app.post('/api/security/check', verifyApiKey, (req, res) => {
    const { address } = req.body;
    
    if (!address) {
        return res.status(400).json({ error: 'Address required' });
    }
    
    // Simulate security check
    const isSafe = Math.random() > 0.1; // 90% safe
    
    res.json({
        success: true,
        data: {
            address,
            safe: isSafe,
            riskLevel: isSafe ? 'low' : 'high',
            threats: isSafe ? [] : ['Suspicious activity detected'],
            checkedAt: new Date().toISOString()
        }
    });
});

// ============================================
// FTSO ENDPOINTS
// ============================================

// Get price for single asset
app.get('/api/ftso/price/:symbol', verifyApiKey, (req, res) => {
    const { symbol } = req.params;
    
    // Simulate FTSO price feed
    const prices = {
        BTC: 50000,
        ETH: 3000,
        FLR: 0.05,
        XRP: 0.5,
        DOGE: 0.08
    };
    
    const price = prices[symbol.toUpperCase()];
    
    if (!price) {
        return res.status(404).json({ error: 'Symbol not found' });
    }
    
    res.json({
        success: true,
        data: {
            symbol: symbol.toUpperCase(),
            price,
            decimals: 18,
            timestamp: new Date().toISOString()
        }
    });
});

// Get multiple prices
app.get('/api/ftso/prices', verifyApiKey, (req, res) => {
    const symbols = req.query.symbols ? req.query.symbols.split(',') : ['BTC', 'ETH', 'FLR'];
    
    const prices = {
        BTC: 50000,
        ETH: 3000,
        FLR: 0.05,
        XRP: 0.5,
        DOGE: 0.08
    };
    
    const result = symbols.map(symbol => ({
        symbol: symbol.toUpperCase(),
        price: prices[symbol.toUpperCase()] || 0,
        decimals: 18,
        timestamp: new Date().toISOString()
    }));
    
    res.json({
        success: true,
        count: result.length,
        data: result
    });
});

// ============================================
// WEBHOOK ENDPOINTS
// ============================================

// Register webhook
app.post('/api/webhooks', verifyApiKey, (req, res) => {
    const { url, events } = req.body;
    
    if (!url || !events) {
        return res.status(400).json({ error: 'URL and events required' });
    }
    
    const webhookId = crypto.randomBytes(16).toString('hex');
    
    res.json({
        success: true,
        data: {
            id: webhookId,
            url,
            events,
            active: true,
            createdAt: new Date().toISOString()
        }
    });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// ============================================
// START SERVER
// ============================================

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`
    ╔═══════════════════════════════════════════╗
    ║   🚀 Flare Autopilot API Server          ║
    ║                                           ║
    ║   Port: ${PORT}                              ║
    ║   Status: Running                         ║
    ║   Docs: http://localhost:${PORT}/api/docs   ║
    ╚═══════════════════════════════════════════╝
        `);
    });
}

// Export for Vercel serverless
module.exports = app;
