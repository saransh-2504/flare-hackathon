/**
 * Security Monitor Bot
 * Monitors security threats and activates circuit breaker
 */

const { ethers } = require("ethers");
const axios = require("axios");

// Configuration
const CONFIG = {
  RPC_URL: "https://coston2-api.flare.network/ext/C/rpc",
  SECURITY_FIREWALL: "YOUR_DEPLOYED_ADDRESS",
  POLL_INTERVAL: 30000, // 30 seconds
};

const SECURITY_FIREWALL_ABI = [
  "function reportThreat(string memory source, uint8 severity, string memory description) external",
  "function reportPriceAnomaly(string memory asset, uint256 priceChange, string memory description) external",
  "function getSecurityStatus() external view returns (uint8, bool, uint256, string)",
  "function isSafeToExecute() external view returns (bool)"
];

class SecurityMonitor {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
    this.wallet = new ethers.Wallet(process.env.EXECUTOR_PRIVATE_KEY, this.provider);
    
    this.securityFirewall = new ethers.Contract(
      CONFIG.SECURITY_FIREWALL,
      SECURITY_FIREWALL_ABI,
      this.wallet
    );
    
    this.threatSources = [
      { name: "CertiK", url: "https://api.certik.com/v1/alerts" },
      { name: "PeckShield", url: "https://api.peckshield.com/alerts" },
      { name: "Chainalysis", url: "https://api.chainalysis.com/threats" }
    ];
    
    this.priceHistory = new Map();
  }

  /**
   * Check security APIs for threats
   */
  async checkSecurityAPIs() {
    console.log("🔍 Checking security APIs...");
    
    // Simulate checking multiple security sources
    // In production, these would be real API calls
    
    const threats = [
      {
        source: "CertiK",
        detected: Math.random() > 0.95, // 5% chance of threat
        severity: Math.floor(Math.random() * 5),
        description: "Suspicious contract interaction detected"
      },
      {
        source: "PeckShield",
        detected: Math.random() > 0.98, // 2% chance
        severity: Math.floor(Math.random() * 5),
        description: "Abnormal transaction pattern"
      }
    ];
    
    for (const threat of threats) {
      if (threat.detected) {
        console.log(`⚠️ THREAT DETECTED: ${threat.source} - ${threat.description}`);
        await this.reportThreat(threat.source, threat.severity, threat.description);
      }
    }
  }

  /**
   * Monitor price anomalies
   */
  async checkPriceAnomalies() {
    const assets = ["BTC", "ETH", "FLR", "XRP"];
    
    for (const asset of assets) {
      try {
        // Get current price (in production, from FTSO)
        const currentPrice = await this.getCurrentPrice(asset);
        
        // Get historical price
        const historicalPrice = this.priceHistory.get(asset);
        
        if (historicalPrice) {
          const priceChange = Math.abs(
            ((currentPrice - historicalPrice) / historicalPrice) * 100
          );
          
          if (priceChange >= 20) {
            console.log(`📊 PRICE ANOMALY: ${asset} changed ${priceChange.toFixed(2)}%`);
            await this.reportPriceAnomaly(
              asset,
              Math.floor(priceChange),
              `${asset} price changed ${priceChange.toFixed(2)}% in 30 seconds`
            );
          }
        }
        
        // Update price history
        this.priceHistory.set(asset, currentPrice);
        
      } catch (error) {
        console.error(`Error checking ${asset} price:`, error.message);
      }
    }
  }

  /**
   * Get current price (mock for demo)
   */
  async getCurrentPrice(asset) {
    // In production, this would call FTSO
    // For demo, simulate price with some volatility
    const basePrices = { BTC: 50000, ETH: 3000, FLR: 0.05, XRP: 0.5 };
    const volatility = (Math.random() - 0.5) * 0.1; // ±5% volatility
    return basePrices[asset] * (1 + volatility);
  }

  /**
   * Report threat to smart contract
   */
  async reportThreat(source, severity, description) {
    try {
      console.log(`📢 Reporting threat to blockchain...`);
      
      const tx = await this.securityFirewall.reportThreat(
        source,
        severity,
        description
      );
      
      console.log(`Transaction sent: ${tx.hash}`);
      await tx.wait();
      
      console.log(`✅ Threat reported successfully!`);
      
      // Check if circuit breaker was activated
      const isSafe = await this.securityFirewall.isSafeToExecute();
      if (!isSafe) {
        console.log(`🚨 CIRCUIT BREAKER ACTIVATED! All operations paused.`);
        this.sendAlert("Circuit breaker activated due to security threat!");
      }
      
    } catch (error) {
      console.error(`Error reporting threat:`, error.message);
    }
  }

  /**
   * Report price anomaly
   */
  async reportPriceAnomaly(asset, priceChange, description) {
    try {
      const tx = await this.securityFirewall.reportPriceAnomaly(
        asset,
        priceChange,
        description
      );
      
      await tx.wait();
      console.log(`✅ Price anomaly reported for ${asset}`);
      
    } catch (error) {
      console.error(`Error reporting price anomaly:`, error.message);
    }
  }

  /**
   * Send alert to users
   */
  sendAlert(message) {
    console.log(`🚨 ALERT: ${message}`);
    // In production, this would send email/SMS/push notifications
  }

  /**
   * Get security status
   */
  async getStatus() {
    try {
      const [threatLevel, circuitBreakerActive, threatsDetected, lastThreat] = 
        await this.securityFirewall.getSecurityStatus();
      
      const threatLevels = ["SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"];
      
      console.log("\n📊 SECURITY STATUS:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`Threat Level: ${threatLevels[threatLevel]}`);
      console.log(`Circuit Breaker: ${circuitBreakerActive ? "🔴 ACTIVE" : "🟢 INACTIVE"}`);
      console.log(`Threats Detected: ${threatsDetected}`);
      console.log(`Last Threat: ${lastThreat}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
      
    } catch (error) {
      console.error("Error getting status:", error.message);
    }
  }

  /**
   * Main monitoring loop
   */
  async start() {
    console.log("🛡️ Security Monitor Bot Started");
    console.log(`Monitoring interval: ${CONFIG.POLL_INTERVAL / 1000}s\n`);

    // Initial status check
    await this.getStatus();

    // Main loop
    setInterval(async () => {
      console.log(`\n⏰ ${new Date().toLocaleTimeString()} - Running security checks...`);
      
      // Check security APIs
      await this.checkSecurityAPIs();
      
      // Check price anomalies
      await this.checkPriceAnomalies();
      
      // Display status
      await this.getStatus();
      
    }, CONFIG.POLL_INTERVAL);
  }
}

// Example usage
async function main() {
  const monitor = new SecurityMonitor();
  await monitor.start();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = SecurityMonitor;
