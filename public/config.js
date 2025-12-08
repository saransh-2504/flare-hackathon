// Configuration for different environments
const config = {
    // API Base URL - automatically detects environment
    API_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api'
        : '/api',
    
    // Flare Network Configuration
    FLARE: {
        COSTON2_RPC: 'https://coston2-api.flare.network/ext/C/rpc',
        COSTON2_CHAIN_ID: '0x72', // 114 in hex
        COSTON2_EXPLORER: 'https://coston2-explorer.flare.network',
        
        MAINNET_RPC: 'https://flare-api.flare.network/ext/C/rpc',
        MAINNET_CHAIN_ID: '0xe', // 14 in hex
        MAINNET_EXPLORER: 'https://flare-explorer.flare.network'
    },
    
    // Contract Addresses (update after deployment)
    CONTRACTS: {
        AUTOMATION_HUB: '0x...',
        FTSO_PRICE_TRIGGER: '0x...',
        FDC_EVENT_TRIGGER: '0x...',
        SMART_ACCOUNT_EXECUTOR: '0x...',
        FASSETS_INTEGRATION: '0x...',
        SECURITY_FIREWALL: '0x...'
    },
    
    // FTSO Registry (Coston2)
    FTSO_REGISTRY: '0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019',
    
    // App Configuration
    APP: {
        NAME: 'Flare Autopilot',
        VERSION: '1.0.0',
        DESCRIPTION: 'Secure Automation Platform for Flare Network'
    },
    
    // Contract ABIs (simplified)
    ABI: {
        AUTOMATION_HUB: [
            "function createStrategy(uint8 _triggerType, uint8 _actionType, bytes memory _triggerData, bytes memory _actionData, uint256 _maxExecutions) external returns (uint256)",
            "function executeStrategy(uint256 _strategyId) external",
            "function pauseStrategy(uint256 _strategyId) external",
            "function resumeStrategy(uint256 _strategyId) external",
            "function strategies(uint256) external view returns (uint256 id, address owner, bool active, uint8 triggerType, uint8 actionType, bytes triggerData, bytes actionData, uint256 lastExecuted, uint256 executionCount, uint256 maxExecutions)",
            "function getUserStrategies(address _user) external view returns (uint256[] memory)",
            "event StrategyCreated(uint256 indexed strategyId, address indexed owner, uint8 triggerType, uint8 actionType)",
            "event StrategyExecuted(uint256 indexed strategyId, address indexed executor, bool success)"
        ],
        FTSO_PRICE_TRIGGER: [
            "function createPriceTrigger(uint256 _strategyId, string memory _symbol, uint256 _targetPrice, bool _isAbove) external",
            "function checkPriceTrigger(uint256 _strategyId) external view returns (bool)",
            "function priceTriggers(uint256) external view returns (string symbol, uint256 targetPrice, bool isAbove, uint256 lastPrice)"
        ],
        FTSO_REGISTRY: [
            "function getCurrentPriceWithDecimals(string memory _symbol) external view returns (uint256 _price, uint256 _timestamp, uint256 _decimals)"
        ]
    }
};

// Make config globally available
window.FLARE_CONFIG = config;
