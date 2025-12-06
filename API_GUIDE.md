# 🔌 Flare Autopilot API - Complete Guide

## Overview

The Flare Autopilot API allows developers to integrate secure automation and security monitoring into their applications.

---

## 🚀 Quick Start

### 1. Get Your API Key

Visit: **http://localhost:8080/api-docs.html**

Or make a POST request:
```bash
curl -X POST "http://localhost:3000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "walletAddress": "0x...",
    "name": "Your Name"
  }'
```

Response:
```json
{
  "success": true,
  "apiKey": "flr_abc123...",
  "tier": "free",
  "rateLimit": 100
}
```

### 2. Start the API Server

```bash
cd api
npm install
npm start
```

Server will run on: **http://localhost:3000**

---

## 📚 API Endpoints

### Authentication

#### Register & Get API Key
```
POST /api/auth/register
```

**Body:**
```json
{
  "email": "your@email.com",
  "walletAddress": "0x...",
  "name": "Your Name"
}
```

#### Get API Key Info
```
GET /api/auth/key
Headers: X-API-Key: your_api_key
```

---

### Strategies

#### Create Strategy
```
POST /api/strategies
Headers: X-API-Key: your_api_key
```

**Body:**
```json
{
  "triggerType": "price",
  "asset": "BTC",
  "condition": "< 50000",
  "action": "mint",
  "amount": 100,
  "protected": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "abc123...",
    "owner": "0x...",
    "triggerType": "price",
    "asset": "BTC",
    "active": true,
    "executions": 0
  }
}
```

#### List Strategies
```
GET /api/strategies
Headers: X-API-Key: your_api_key
```

#### Get Strategy by ID
```
GET /api/strategies/:id
Headers: X-API-Key: your_api_key
```

#### Delete Strategy
```
DELETE /api/strategies/:id
Headers: X-API-Key: your_api_key
```

---

### Security

#### Get Security Status
```
GET /api/security/status
Headers: X-API-Key: your_api_key
```

**Response:**
```json
{
  "success": true,
  "data": {
    "threatLevel": "SAFE",
    "circuitBreakerActive": false,
    "threatsDetected": 0,
    "sources": {
      "certik": { "status": "operational" },
      "peckshield": { "status": "operational" }
    }
  }
}
```

#### Get Threat Alerts
```
GET /api/security/threats
Headers: X-API-Key: your_api_key
```

#### Check Address Security
```
POST /api/security/check
Headers: X-API-Key: your_api_key
```

**Body:**
```json
{
  "address": "0x..."
}
```

---

### FTSO Price Feeds

#### Get Single Price
```
GET /api/ftso/price/:symbol
Headers: X-API-Key: your_api_key
```

**Example:**
```bash
curl "http://localhost:3000/api/ftso/price/BTC" \
  -H "X-API-Key: your_api_key"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "BTC",
    "price": 50000,
    "decimals": 18,
    "timestamp": "2024-12-07T10:30:00Z"
  }
}
```

#### Get Multiple Prices
```
GET /api/ftso/prices?symbols=BTC,ETH,FLR
Headers: X-API-Key: your_api_key
```

---

## 💻 Code Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const API_KEY = 'your_api_key_here';
const BASE_URL = 'http://localhost:3000/api';

// Create strategy
async function createStrategy() {
  const response = await axios.post(
    `${BASE_URL}/strategies`,
    {
      triggerType: 'price',
      asset: 'BTC',
      condition: '< 50000',
      action: 'mint',
      amount: 100,
      protected: true
    },
    {
      headers: { 'X-API-Key': API_KEY }
    }
  );
  
  console.log('Strategy created:', response.data);
}

// Get security status
async function getSecurityStatus() {
  const response = await axios.get(
    `${BASE_URL}/security/status`,
    {
      headers: { 'X-API-Key': API_KEY }
    }
  );
  
  console.log('Security status:', response.data);
}

// Get BTC price
async function getBTCPrice() {
  const response = await axios.get(
    `${BASE_URL}/ftso/price/BTC`,
    {
      headers: { 'X-API-Key': API_KEY }
    }
  );
  
  console.log('BTC Price:', response.data.data.price);
}
```

### Python

```python
import requests

API_KEY = 'your_api_key_here'
BASE_URL = 'http://localhost:3000/api'

headers = {'X-API-Key': API_KEY}

# Create strategy
def create_strategy():
    data = {
        'triggerType': 'price',
        'asset': 'BTC',
        'condition': '< 50000',
        'action': 'mint',
        'amount': 100,
        'protected': True
    }
    
    response = requests.post(
        f'{BASE_URL}/strategies',
        json=data,
        headers=headers
    )
    
    print('Strategy created:', response.json())

# Get security status
def get_security_status():
    response = requests.get(
        f'{BASE_URL}/security/status',
        headers=headers
    )
    
    print('Security status:', response.json())
```

### React/Frontend

```javascript
import React, { useState, useEffect } from 'react';

const API_KEY = 'your_api_key_here';
const BASE_URL = 'http://localhost:3000/api';

function FlareAutopilot() {
  const [strategies, setStrategies] = useState([]);
  const [securityStatus, setSecurityStatus] = useState(null);

  useEffect(() => {
    fetchStrategies();
    fetchSecurityStatus();
  }, []);

  const fetchStrategies = async () => {
    const response = await fetch(`${BASE_URL}/strategies`, {
      headers: { 'X-API-Key': API_KEY }
    });
    const data = await response.json();
    setStrategies(data.data);
  };

  const fetchSecurityStatus = async () => {
    const response = await fetch(`${BASE_URL}/security/status`, {
      headers: { 'X-API-Key': API_KEY }
    });
    const data = await response.json();
    setSecurityStatus(data.data);
  };

  const createStrategy = async (strategyData) => {
    const response = await fetch(`${BASE_URL}/strategies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify(strategyData)
    });
    
    if (response.ok) {
      fetchStrategies(); // Refresh list
    }
  };

  return (
    <div>
      <h1>Flare Autopilot Integration</h1>
      
      {securityStatus && (
        <div>
          <h2>Security Status: {securityStatus.threatLevel}</h2>
        </div>
      )}
      
      <div>
        <h2>My Strategies ({strategies.length})</h2>
        {strategies.map(strategy => (
          <div key={strategy.id}>
            {strategy.asset} - {strategy.action}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🔒 Authentication

All API requests (except `/api/health` and `/api/docs`) require an API key.

Include your API key in the request header:
```
X-API-Key: your_api_key_here
```

---

## ⚡ Rate Limits

| Tier | Requests/Hour | Price |
|------|---------------|-------|
| Free | 100 | $0 |
| Pro | 1,000 | $29/month |
| Enterprise | Unlimited | Contact us |

---

## 🎯 Use Cases

### 1. DeFi Dashboard
Integrate Flare Autopilot into your DeFi dashboard to show:
- Active automation strategies
- Security status
- Real-time price feeds

### 2. Trading Bot
Use the API to:
- Create automated trading strategies
- Monitor security threats
- Get FTSO price feeds

### 3. Portfolio Manager
Build a portfolio manager that:
- Auto-rebalances based on price movements
- Protects assets with security firewall
- Executes gasless via Smart Accounts

### 4. Security Monitoring Service
Create a security service that:
- Monitors multiple wallets
- Alerts on threats
- Auto-pauses risky operations

---

## 🚀 Deployment

### Production Setup

1. **Environment Variables:**
```bash
PORT=3000
NODE_ENV=production
DATABASE_URL=your_database_url
```

2. **Start Server:**
```bash
npm start
```

3. **Use Process Manager:**
```bash
pm2 start server.js --name flare-api
```

---

## 📊 Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Error:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## 🎉 Benefits of Using the API

1. **Easy Integration** - RESTful API, works with any language
2. **Secure** - API key authentication
3. **Reliable** - Built on Flare's robust infrastructure
4. **Gasless** - All operations via Smart Accounts
5. **Real-time** - Live security monitoring and price feeds
6. **Scalable** - From hobby projects to enterprise apps

---

## 💡 Support

- **Documentation**: http://localhost:8080/api-docs.html
- **GitHub**: https://github.com/your-repo
- **Discord**: https://discord.gg/flarenetwork

---

**Built with ❤️ for Flare Network Hackathon 2024**
