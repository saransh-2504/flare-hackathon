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
    }
};

// Make config globally available
window.FLARE_CONFIG = config;
