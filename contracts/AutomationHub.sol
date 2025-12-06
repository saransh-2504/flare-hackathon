// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AutomationHub
 * @notice Core contract for Flare Autopilot - manages automation strategies
 * @dev Integrates with Smart Accounts, FDC, FTSO, and FAssets
 */
contract AutomationHub is Ownable, ReentrancyGuard {
    
    // Strategy types
    enum TriggerType {
        PRICE_ABOVE,      // FTSO: Price goes above threshold
        PRICE_BELOW,      // FTSO: Price goes below threshold
        PRICE_CHANGE,     // FTSO: Price changes by percentage
        FDC_EVENT,        // FDC: External event verified
        TIME_BASED,       // Execute at specific time
        COMPOSITE         // Multiple conditions
    }
    
    enum ActionType {
        SWAP,             // Swap tokens
        TRANSFER,         // Send tokens
        MINT_FASSETS,     // Mint FAssets
        REDEEM_FASSETS,   // Redeem FAssets
        CUSTOM            // Custom contract call
    }
    
    // Strategy structure
    struct Strategy {
        uint256 id;
        address owner;
        bool active;
        TriggerType triggerType;
        ActionType actionType;
        bytes triggerData;    // Encoded trigger parameters
        bytes actionData;     // Encoded action parameters
        uint256 lastExecuted;
        uint256 executionCount;
        uint256 maxExecutions; // 0 = unlimited
    }
    
    // State variables
    uint256 public strategyCounter;
    mapping(uint256 => Strategy) public strategies;
    mapping(address => uint256[]) public userStrategies;
    
    // Authorized executors (bots that can trigger strategies)
    mapping(address => bool) public authorizedExecutors;
    
    // Events
    event StrategyCreated(uint256 indexed strategyId, address indexed owner, TriggerType triggerType);
    event StrategyExecuted(uint256 indexed strategyId, address indexed executor);
    event StrategyDeactivated(uint256 indexed strategyId);
    event ExecutorAuthorized(address indexed executor);
    event ExecutorRevoked(address indexed executor);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @notice Create a new automation strategy
     */
    function createStrategy(
        TriggerType _triggerType,
        ActionType _actionType,
        bytes calldata _triggerData,
        bytes calldata _actionData,
        uint256 _maxExecutions
    ) external returns (uint256) {
        strategyCounter++;
        uint256 strategyId = strategyCounter;
        
        strategies[strategyId] = Strategy({
            id: strategyId,
            owner: msg.sender,
            active: true,
            triggerType: _triggerType,
            actionType: _actionType,
            triggerData: _triggerData,
            actionData: _actionData,
            lastExecuted: 0,
            executionCount: 0,
            maxExecutions: _maxExecutions
        });
        
        userStrategies[msg.sender].push(strategyId);
        
        emit StrategyCreated(strategyId, msg.sender, _triggerType);
        return strategyId;
    }
    
    /**
     * @notice Execute a strategy (called by authorized executors)
     */
    function executeStrategy(uint256 _strategyId) external nonReentrant {
        require(authorizedExecutors[msg.sender], "Not authorized");
        
        Strategy storage strategy = strategies[_strategyId];
        require(strategy.active, "Strategy not active");
        require(strategy.owner != address(0), "Strategy does not exist");
        
        // Check max executions
        if (strategy.maxExecutions > 0) {
            require(strategy.executionCount < strategy.maxExecutions, "Max executions reached");
        }
        
        // Execute the action
        _executeAction(strategy);
        
        strategy.lastExecuted = block.timestamp;
        strategy.executionCount++;
        
        emit StrategyExecuted(_strategyId, msg.sender);
    }
    
    /**
     * @notice Internal function to execute strategy action
     */
    function _executeAction(Strategy storage strategy) internal {
        // This will be implemented based on action type
        // For hackathon, we'll implement basic swap and transfer
        if (strategy.actionType == ActionType.TRANSFER) {
            _executeTransfer(strategy.actionData);
        } else if (strategy.actionType == ActionType.SWAP) {
            _executeSwap(strategy.actionData);
        }
        // Add more action types as needed
    }
    
    function _executeTransfer(bytes memory actionData) internal {
        (address token, address recipient, uint256 amount) = abi.decode(
            actionData,
            (address, address, uint256)
        );
        // Transfer logic here
    }
    
    function _executeSwap(bytes memory actionData) internal {
        // Swap logic here - integrate with DEX
    }
    
    /**
     * @notice Deactivate a strategy
     */
    function deactivateStrategy(uint256 _strategyId) external {
        Strategy storage strategy = strategies[_strategyId];
        require(strategy.owner == msg.sender, "Not strategy owner");
        strategy.active = false;
        emit StrategyDeactivated(_strategyId);
    }
    
    /**
     * @notice Reactivate a strategy
     */
    function reactivateStrategy(uint256 _strategyId) external {
        Strategy storage strategy = strategies[_strategyId];
        require(strategy.owner == msg.sender, "Not strategy owner");
        strategy.active = true;
    }
    
    /**
     * @notice Get user's strategies
     */
    function getUserStrategies(address user) external view returns (uint256[] memory) {
        return userStrategies[user];
    }
    
    /**
     * @notice Authorize an executor
     */
    function authorizeExecutor(address executor) external onlyOwner {
        authorizedExecutors[executor] = true;
        emit ExecutorAuthorized(executor);
    }
    
    /**
     * @notice Revoke executor authorization
     */
    function revokeExecutor(address executor) external onlyOwner {
        authorizedExecutors[executor] = false;
        emit ExecutorRevoked(executor);
    }
}
