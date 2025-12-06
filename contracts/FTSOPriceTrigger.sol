// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// FTSO Registry interface (simplified)
interface IFtsoRegistry {
    function getCurrentPriceWithDecimals(string memory _symbol) 
        external view returns (uint256 _price, uint256 _timestamp, uint256 _decimals);
}

/**
 * @title FTSOPriceTrigger
 * @notice Handles FTSO price-based triggers for automation
 * @dev Integrates with Flare Time Series Oracle
 */
contract FTSOPriceTrigger {
    
    // Flare Coston2 FTSO Registry
    address public constant FTSO_REGISTRY = 0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019;
    
    struct PriceTrigger {
        string symbol;        // e.g., "BTC", "ETH", "FLR"
        uint256 targetPrice;  // Target price with decimals
        bool isAbove;         // true = trigger when above, false = trigger when below
        uint256 lastPrice;    // Last checked price
    }
    
    mapping(uint256 => PriceTrigger) public priceTriggers;
    
    event PriceTriggerCreated(uint256 indexed strategyId, string symbol, uint256 targetPrice);
    event PriceTriggerMet(uint256 indexed strategyId, uint256 currentPrice);
    
    /**
     * @notice Create a price trigger
     */
    function createPriceTrigger(
        uint256 strategyId,
        string memory symbol,
        uint256 targetPrice,
        bool isAbove
    ) external {
        priceTriggers[strategyId] = PriceTrigger({
            symbol: symbol,
            targetPrice: targetPrice,
            isAbove: isAbove,
            lastPrice: 0
        });
        
        emit PriceTriggerCreated(strategyId, symbol, targetPrice);
    }
    
    /**
     * @notice Check if price trigger condition is met
     */
    function checkPriceTrigger(uint256 strategyId) external view returns (bool) {
        PriceTrigger memory trigger = priceTriggers[strategyId];
        
        (uint256 currentPrice, , ) = IFtsoRegistry(FTSO_REGISTRY)
            .getCurrentPriceWithDecimals(trigger.symbol);
        
        if (trigger.isAbove) {
            return currentPrice >= trigger.targetPrice;
        } else {
            return currentPrice <= trigger.targetPrice;
        }
    }
    
    /**
     * @notice Get current price for a symbol
     */
    function getCurrentPrice(string memory symbol) 
        external view returns (uint256 price, uint256 timestamp, uint256 decimals) 
    {
        return IFtsoRegistry(FTSO_REGISTRY).getCurrentPriceWithDecimals(symbol);
    }
    
    /**
     * @notice Check percentage change trigger
     */
    function checkPercentageChange(
        uint256 strategyId,
        uint256 percentageThreshold
    ) external view returns (bool) {
        PriceTrigger memory trigger = priceTriggers[strategyId];
        
        (uint256 currentPrice, , ) = IFtsoRegistry(FTSO_REGISTRY)
            .getCurrentPriceWithDecimals(trigger.symbol);
        
        if (trigger.lastPrice == 0) return false;
        
        uint256 change;
        if (currentPrice > trigger.lastPrice) {
            change = ((currentPrice - trigger.lastPrice) * 100) / trigger.lastPrice;
        } else {
            change = ((trigger.lastPrice - currentPrice) * 100) / trigger.lastPrice;
        }
        
        return change >= percentageThreshold;
    }
}
