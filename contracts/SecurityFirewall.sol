// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SecurityFirewall
 * @notice Smart Contract Firewall/Circuit Breaker for Flare Autopilot
 * @dev Monitors threats via FDC and pauses operations automatically
 * 
 * HOW IT PROTECTS YOUR AUTOMATIONS:
 * 1. FDC monitors security APIs (exploit databases, anomaly detection)
 * 2. FTSO detects abnormal price movements (flash crashes, exploits)
 * 3. If threat detected → automatically pause all strategies
 * 4. Emergency mode → move funds to safety via FAssets
 * 5. Alert users → send notifications
 */
contract SecurityFirewall is Ownable, ReentrancyGuard {
    
    // Security threat levels
    enum ThreatLevel {
        SAFE,           // No threats detected
        LOW,            // Minor anomaly detected
        MEDIUM,         // Suspicious activity
        HIGH,           // Active threat detected
        CRITICAL        // Exploit in progress
    }
    
    // Security status
    struct SecurityStatus {
        ThreatLevel currentThreat;
        bool circuitBreakerActive;
        uint256 lastCheckTimestamp;
        uint256 threatsDetected;
        string lastThreatDescription;
    }
    
    // Threat detection sources
    struct ThreatSource {
        string name;              // e.g., "CertiK Alert", "PeckShield"
        bool active;
        uint256 lastUpdate;
        ThreatLevel severity;
    }
    
    // Protected strategy
    struct ProtectedStrategy {
        uint256 strategyId;
        address owner;
        bool protected;
        bool paused;
        uint256 fundsAtRisk;      // Amount in USD
        address safetyVault;      // Where to move funds in emergency
    }
    
    // State variables
    SecurityStatus public securityStatus;
    mapping(uint256 => ProtectedStrategy) public protectedStrategies;
    mapping(string => ThreatSource) public threatSources;
    
    // Emergency contacts
    address public automationHubAddress;
    address public emergencyVault;
    
    // Thresholds
    uint256 public priceAnomalyThreshold = 20; // 20% price change = anomaly
    uint256 public autoCircuitBreakerThreshold = 3; // 3 threats = auto pause
    
    // Events
    event ThreatDetected(ThreatLevel level, string description, uint256 timestamp);
    event CircuitBreakerActivated(string reason, uint256 timestamp);
    event CircuitBreakerDeactivated(uint256 timestamp);
    event StrategyPaused(uint256 indexed strategyId, string reason);
    event EmergencyFundTransfer(uint256 indexed strategyId, uint256 amount, address to);
    event SecurityCheckPassed(uint256 timestamp);
    
    constructor() Ownable(msg.sender) {
        securityStatus = SecurityStatus({
            currentThreat: ThreatLevel.SAFE,
            circuitBreakerActive: false,
            lastCheckTimestamp: block.timestamp,
            threatsDetected: 0,
            lastThreatDescription: "System initialized"
        });
        
        // Initialize threat sources
        _initializeThreatSources();
    }
    
    /**
     * @notice Initialize security monitoring sources
     */
    function _initializeThreatSources() internal {
        threatSources["CertiK"] = ThreatSource("CertiK Alert", true, block.timestamp, ThreatLevel.SAFE);
        threatSources["PeckShield"] = ThreatSource("PeckShield", true, block.timestamp, ThreatLevel.SAFE);
        threatSources["Chainalysis"] = ThreatSource("Chainalysis", true, block.timestamp, ThreatLevel.SAFE);
        threatSources["FTSO_Anomaly"] = ThreatSource("FTSO Price Anomaly", true, block.timestamp, ThreatLevel.SAFE);
    }
    
    /**
     * @notice Register a strategy for protection
     */
    function registerStrategy(
        uint256 strategyId,
        address owner,
        uint256 fundsAtRisk,
        address safetyVault
    ) external {
        protectedStrategies[strategyId] = ProtectedStrategy({
            strategyId: strategyId,
            owner: owner,
            protected: true,
            paused: false,
            fundsAtRisk: fundsAtRisk,
            safetyVault: safetyVault
        });
    }
    
    /**
     * @notice Report threat detected by FDC
     * @dev Called by FDC monitoring bot
     */
    function reportThreat(
        string memory source,
        ThreatLevel severity,
        string memory description
    ) external {
        // Update threat source
        threatSources[source].severity = severity;
        threatSources[source].lastUpdate = block.timestamp;
        
        // Update security status
        if (severity > securityStatus.currentThreat) {
            securityStatus.currentThreat = severity;
            securityStatus.lastThreatDescription = description;
        }
        
        securityStatus.threatsDetected++;
        securityStatus.lastCheckTimestamp = block.timestamp;
        
        emit ThreatDetected(severity, description, block.timestamp);
        
        // Auto-activate circuit breaker if threshold reached
        if (severity >= ThreatLevel.HIGH || 
            securityStatus.threatsDetected >= autoCircuitBreakerThreshold) {
            _activateCircuitBreaker(description);
        }
    }
    
    /**
     * @notice Report price anomaly detected by FTSO
     */
    function reportPriceAnomaly(
        string memory asset,
        uint256 priceChange,
        string memory description
    ) external {
        if (priceChange >= priceAnomalyThreshold) {
            threatSources["FTSO_Anomaly"].severity = ThreatLevel.MEDIUM;
            threatSources["FTSO_Anomaly"].lastUpdate = block.timestamp;
            
            string memory fullDescription = string(abi.encodePacked(
                "Price anomaly detected: ", asset, " - ", description
            ));
            
            emit ThreatDetected(ThreatLevel.MEDIUM, fullDescription, block.timestamp);
            
            // If price drops >50%, activate circuit breaker
            if (priceChange >= 50) {
                _activateCircuitBreaker(fullDescription);
            }
        }
    }
    
    /**
     * @notice Activate circuit breaker (pause all operations)
     */
    function _activateCircuitBreaker(string memory reason) internal {
        if (!securityStatus.circuitBreakerActive) {
            securityStatus.circuitBreakerActive = true;
            emit CircuitBreakerActivated(reason, block.timestamp);
            
            // Pause all protected strategies
            // In production, this would iterate through all strategies
        }
    }
    
    /**
     * @notice Manual circuit breaker activation (admin only)
     */
    function activateCircuitBreaker(string memory reason) external onlyOwner {
        _activateCircuitBreaker(reason);
    }
    
    /**
     * @notice Deactivate circuit breaker
     */
    function deactivateCircuitBreaker() external onlyOwner {
        securityStatus.circuitBreakerActive = false;
        securityStatus.currentThreat = ThreatLevel.SAFE;
        securityStatus.threatsDetected = 0;
        emit CircuitBreakerDeactivated(block.timestamp);
    }
    
    /**
     * @notice Pause specific strategy
     */
    function pauseStrategy(uint256 strategyId, string memory reason) external {
        ProtectedStrategy storage strategy = protectedStrategies[strategyId];
        require(strategy.protected, "Strategy not protected");
        
        strategy.paused = true;
        emit StrategyPaused(strategyId, reason);
    }
    
    /**
     * @notice Emergency fund transfer to safety vault
     */
    function emergencyTransfer(uint256 strategyId) external nonReentrant {
        ProtectedStrategy storage strategy = protectedStrategies[strategyId];
        require(strategy.protected, "Strategy not protected");
        require(securityStatus.circuitBreakerActive, "No emergency");
        
        // In production, this would actually transfer funds
        emit EmergencyFundTransfer(strategyId, strategy.fundsAtRisk, strategy.safetyVault);
    }
    
    /**
     * @notice Check if operations are safe to execute
     */
    function isSafeToExecute() external view returns (bool) {
        return !securityStatus.circuitBreakerActive && 
               securityStatus.currentThreat <= ThreatLevel.LOW;
    }
    
    /**
     * @notice Get current security status
     */
    function getSecurityStatus() external view returns (
        ThreatLevel currentThreat,
        bool circuitBreakerActive,
        uint256 threatsDetected,
        string memory lastThreatDescription
    ) {
        return (
            securityStatus.currentThreat,
            securityStatus.circuitBreakerActive,
            securityStatus.threatsDetected,
            securityStatus.lastThreatDescription
        );
    }
    
    /**
     * @notice Get threat source status
     */
    function getThreatSource(string memory source) external view returns (
        bool active,
        uint256 lastUpdate,
        ThreatLevel severity
    ) {
        ThreatSource memory ts = threatSources[source];
        return (ts.active, ts.lastUpdate, ts.severity);
    }
    
    /**
     * @notice Update automation hub address
     */
    function setAutomationHub(address _hub) external onlyOwner {
        automationHubAddress = _hub;
    }
    
    /**
     * @notice Update emergency vault
     */
    function setEmergencyVault(address _vault) external onlyOwner {
        emergencyVault = _vault;
    }
    
    /**
     * @notice Update price anomaly threshold
     */
    function setPriceAnomalyThreshold(uint256 _threshold) external onlyOwner {
        priceAnomalyThreshold = _threshold;
    }
}
