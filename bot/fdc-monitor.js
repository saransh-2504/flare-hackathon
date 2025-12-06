/**
 * FDC Event Monitor Bot
 * Monitors real-world events and triggers strategies via FDC attestations
 */

const { ethers } = require("ethers");
const axios = require("axios");

// Configuration
const CONFIG = {
  RPC_URL: "https://coston2-api.flare.network/ext/C/rpc",
  AUTOMATION_HUB: "YOUR_DEPLOYED_ADDRESS",
  FDC_EVENT_TRIGGER: "YOUR_DEPLOYED_ADDRESS",
  POLL_INTERVAL: 60000, // 60 seconds
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  WEATHER_API_KEY: process.env.WEATHER_API_KEY,
};

const FDC_EVENT_TRIGGER_ABI = [
  "function verifyEvent(uint256 strategyId, bytes calldata attestationData) external",
  "function checkEventTrigger(uint256 strategyId) external view returns (bool)",
  "function getEventTrigger(uint256 strategyId) external view returns (uint8 eventType, bytes32 eventIdentifier, uint256 threshold, bool triggered)"
];

class FDCMonitor {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
    this.wallet = new ethers.Wallet(process.env.EXECUTOR_PRIVATE_KEY, this.provider);
    
    this.fdcEventTrigger = new ethers.Contract(
      CONFIG.FDC_EVENT_TRIGGER,
      FDC_EVENT_TRIGGER_ABI,
      this.wallet
    );
    
    this.monitoredEvents = new Map();
  }

  /**
   * Check GitHub repository stars
   */
  async checkGitHubStars(repo) {
    try {
      const response = await axios.get(`https://api.github.com/repos/${repo}`, {
        headers: CONFIG.GITHUB_TOKEN ? {
          'Authorization': `token ${CONFIG.GITHUB_TOKEN}`
        } : {}
      });
      
      return {
        stars: response.data.stargazers_count,
        forks: response.data.forks_count,
        watchers: response.data.watchers_count,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`Error fetching GitHub data for ${repo}:`, error.message);
      return null;
    }
  }

  /**
   * Check weather data
   */
  async checkWeather(city) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${CONFIG.WEATHER_API_KEY}`
      );
      
      return {
        weather: response.data.weather[0].main,
        description: response.data.weather[0].description,
        temp: response.data.main.temp,
        humidity: response.data.main.humidity,
        isRaining: response.data.weather[0].main.toLowerCase().includes('rain'),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`Error fetching weather for ${city}:`, error.message);
      return null;
    }
  }

  /**
   * Generate attestation data (simplified for hackathon)
   */
  generateAttestation(eventType, data) {
    // In production, this would generate proper FDC attestation proof
    // For hackathon, we'll use simplified encoding
    const attestation = {
      eventType,
      data,
      timestamp: Date.now(),
      verifier: this.wallet.address
    };
    
    return ethers.AbiCoder.defaultAbiCoder().encode(
      ["uint8", "bytes", "uint256", "address"],
      [eventType, ethers.toUtf8Bytes(JSON.stringify(data)), attestation.timestamp, attestation.verifier]
    );
  }

  /**
   * Verify and submit event
   */
  async verifyEvent(strategyId, eventType, data) {
    try {
      console.log(`Verifying event for strategy ${strategyId}...`);
      
      const attestationData = this.generateAttestation(eventType, data);
      
      const tx = await this.fdcEventTrigger.verifyEvent(strategyId, attestationData);
      console.log(`Transaction sent: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log(`✅ Event verified for strategy ${strategyId}!`);
      
      return true;
    } catch (error) {
      console.error(`Error verifying event for strategy ${strategyId}:`, error.message);
      return false;
    }
  }

  /**
   * Monitor GitHub event
   */
  async monitorGitHub(strategyId, repo, threshold) {
    const data = await this.checkGitHubStars(repo);
    
    if (data && data.stars >= threshold) {
      console.log(`🎯 GitHub milestone reached! ${repo} has ${data.stars} stars (threshold: ${threshold})`);
      await this.verifyEvent(strategyId, 0, data); // EventType.GITHUB_STARS = 0
      return true;
    }
    
    return false;
  }

  /**
   * Monitor weather event
   */
  async monitorWeather(strategyId, city, condition) {
    const data = await this.checkWeather(city);
    
    if (data && condition === "rain" && data.isRaining) {
      console.log(`🎯 Weather condition met! It's raining in ${city}`);
      await this.verifyEvent(strategyId, 1, data); // EventType.WEATHER_DATA = 1
      return true;
    }
    
    return false;
  }

  /**
   * Add event to monitor
   */
  addEvent(strategyId, eventConfig) {
    this.monitoredEvents.set(strategyId, eventConfig);
    console.log(`Now monitoring event for strategy ${strategyId}`);
  }

  /**
   * Main monitoring loop
   */
  async start() {
    console.log("🤖 FDC Event Monitor Bot Started");
    console.log(`Monitoring ${this.monitoredEvents.size} events`);
    console.log(`Poll interval: ${CONFIG.POLL_INTERVAL / 1000}s\n`);

    // Main loop
    setInterval(async () => {
      for (const [strategyId, config] of this.monitoredEvents) {
        // Check if already triggered
        const isTriggered = await this.fdcEventTrigger.checkEventTrigger(strategyId);
        if (isTriggered) {
          console.log(`Strategy ${strategyId} already triggered, skipping...`);
          continue;
        }

        // Monitor based on event type
        if (config.type === "github") {
          await this.monitorGitHub(strategyId, config.repo, config.threshold);
        } else if (config.type === "weather") {
          await this.monitorWeather(strategyId, config.city, config.condition);
        }
      }
    }, CONFIG.POLL_INTERVAL);
  }
}

// Example usage
async function main() {
  const monitor = new FDCMonitor();
  
  // Add events to monitor
  monitor.addEvent(1, {
    type: "github",
    repo: "flare-foundation/flare",
    threshold: 1000
  });
  
  monitor.addEvent(2, {
    type: "weather",
    city: "Mumbai",
    condition: "rain"
  });
  
  // Start monitoring
  await monitor.start();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = FDCMonitor;
