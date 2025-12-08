/**
 * Auto Monitor Bot
 * Automatically discovers and monitors all active strategies
 */

const { ethers } = require("ethers");
require('dotenv').config();

// Configuration from .env
const CONFIG = {
    RPC_URL: process.env.RPC_URL || "https://coston2-api.flare.network/ext/C/rpc",
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    AUTOMATION_HUB: process.env.AUTOMATION_HUB,
    FTSO_PRICE_TRIGGER: process.env.FTSO_PRICE_TRIGGER,
    FTSO_REGISTRY: process.env.FTSO_REGISTRY || "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019",
    POLL_INTERVAL: 30000, // 30 seconds
    DISCOVERY_INTERVAL: 300000, // 5 minutes
};

// Smart Contract ABIs
const FTSO_ABI = [
    "function getCurrentPriceWithDecimals(string memory _symbol) external view returns (uint256 _price, uint256 _timestamp, uint256 _decimals)"
];

const HUB_ABI = [
    "function executeStrategy(uint256 _strategyId) external",
    "function strategies(uint256) external view returns (uint256 id, address owner, bool active, uint8 triggerType, uint8 actionType, bytes triggerData, bytes actionData, uint256 lastExecuted, uint256 executionCount, uint256 maxExecutions)",
    "