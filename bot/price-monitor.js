/**
 * Price Monitor Bot
 * Monitors FTSO price feeds and triggers strategies when conditions are met
 */

const { ethers } = require("ethers");

// Configuration
const CONFIG = {
  RPC_URL: "https://coston2-api.flare.network/ext/C/rpc",
  FTSO_REGISTRY: "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019",
  AUTOMATION_HUB: "YOUR_DEPLOYED_ADDRESS",
  FTSO_PRICE_TRIGGER: "YOUR_DEPLOYED_ADDRESS",
  POLL_INTERVAL: 30000, // 30 seconds
};

// ABI snippets (simplified)
const FTSO_REGISTRY_ABI = [
  "function getCurrentPriceWithDecimals(string memory _symbol) external view returns (uint256 _price, uint256 _timestamp, uint256 _decimals)"
];

const AUTOMATION_HUB_ABI = [
  "function executeStrategy(uint256 _strategyId) external",
  "function strategies(uint256) external view returns (uint256 id, address owner, bool active, uint8 triggerType, uint8 actionType, bytes triggerData, bytes actionData, uint256 lastExecuted, uint256 executionCount, uint256 maxExecutions)"
];

const FTSO_PRICE_TRIGGER_ABI = [
  "function checkPriceTrigger(uint256 strategyId) external view returns (bool)"
];

class PriceMonitor {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
    this.wallet = new ethers.Wallet(process.env.EXECUTOR_PRIVATE_KEY, this.provider);
    
    this.ftsoRegistry = new ethers.Contract(
      CONFIG.FTSO_REGISTRY,
      FTSO_REGISTRY_ABI,
      this.provider
    );
    
    this.automationHub = new ethers.Contract(
      CONFIG.AUTOMATION_HUB,
      AUTOMATION_HUB_ABI,
      this.wallet
    );
    
    this.ftsoPriceTrigger = new ethers.Contract(
      CONFIG.FTSO_PRICE_TRIGGER,
      FTSO_PRICE_TRIGGER_ABI,
      this.provider
    );
    
    this.monitoredStrategies = new Set();
  }

  /**
   * Get current price for a symbol
   */
  async getPrice(symbol) {
    try {
      const [price, timestamp, decimals] = await this.ftsoRegistry.getCurrentPriceWithDecimals(symbol);
      return {
        price: price,
        timestamp: timestamp,
        decimals: decimals,
        priceFormatted: Number(price) / Math.pow(10, Number(decimals))
      };
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error.message);
      return null;
    }
  }

  /**
   * Check if a strategy's trigger condition is met
   */
  async checkStrategy(strategyId) {
    try {
      const strategy = await this.automationHub.strategies(strategyId);
      
      // Check if strategy is active
      if (!strategy.active) {
        return false;
      }

      // Check if it's a price-based trigger (type 0, 1, or 2)
      const triggerType = strategy.triggerType;
      if (triggerType > 2) {
        return false; // Not a price trigger
      }

      // Check if trigger condition is met
      const isTriggered = await this.ftsoPriceTrigger.checkPriceTrigger(strategyId);
      return isTriggered;
    } catch (error) {
      console.error(`Error checking strategy ${strategyId}:`, error.message);
      return false;
    }
  }

  /**
   * Execute a strategy
   */
  async executeStrategy(strategyId) {
    try {
      console.log(`Executing strategy ${strategyId}...`);
      
      const tx = await this.automationHub.executeStrategy(strategyId);
      console.log(`Transaction sent: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log(`✅ Strategy ${strategyId} executed successfully!`);
      console.log(`Gas used: ${receipt.gasUsed.toString()}`);
      
      return true;
    } catch (error) {
      console.error(`Error executing strategy ${strategyId}:`, error.message);
      return false;
    }
  }

  /**
   * Monitor a specific strategy
   */
  addStrategy(strategyId) {
    this.monitoredStrategies.add(strategyId);
    console.log(`Now monitoring strategy ${strategyId}`);
  }

  /**
   * Main monitoring loop
   */
  async start() {
    console.log("🤖 Price Monitor Bot Started");
    console.log(`Monitoring ${this.monitoredStrategies.size} strategies`);
    console.log(`Poll interval: ${CONFIG.POLL_INTERVAL / 1000}s\n`);

    // Display some prices
    const symbols = ["BTC", "ETH", "FLR", "XRP"];
    for (const symbol of symbols) {
      const priceData = await this.getPrice(symbol);
      if (priceData) {
        console.log(`${symbol}: $${priceData.priceFormatted.toFixed(2)}`);
      }
    }
    console.log("");

    // Main loop
    setInterval(async () => {
      for (const strategyId of this.monitoredStrategies) {
        const shouldExecute = await this.checkStrategy(strategyId);
        
        if (shouldExecute) {
          console.log(`🎯 Strategy ${strategyId} triggered!`);
          await this.executeStrategy(strategyId);
        }
      }
    }, CONFIG.POLL_INTERVAL);
  }
}

// Example usage
async function main() {
  const monitor = new PriceMonitor();
  
  // Add strategies to monitor (replace with actual strategy IDs)
  monitor.addStrategy(1);
  monitor.addStrategy(2);
  
  // Start monitoring
  await monitor.start();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = PriceMonitor;
