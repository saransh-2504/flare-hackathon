# Flare Autopilot - Architecture

## System Overview

Flare Autopilot is a Smart Account automation platform that enables gasless, event-driven execution of crypto strategies on Flare Network.

## Core Components

### 1. AutomationHub (Main Contract)
- Central registry for all automation strategies
- Manages strategy lifecycle (create, execute, deactivate)
- Coordinates with trigger and executor contracts
- Handles authorization and access control

### 2. FTSOPriceTrigger
- Integrates with Flare Time Series Oracle (FTSO)
- Monitors price movements for trigger conditions
- Supports:
  - Price above/below thresholds
  - Percentage change triggers
  - Multi-asset price monitoring

### 3. FDCEventTrigger
- Integrates with Flare Data Connector (FDC)
- Verifies real-world events through attestations
- Supports:
  - GitHub milestones (stars, commits, PRs)
  - Weather data
  - API webhooks
  - Payment confirmations
  - Custom events

### 4. SmartAccountExecutor
- Enables gasless execution via Flare Smart Accounts
- Handles signature verification
- Supports batch operations
- Manages nonces and replay protection

### 5. FAssetsIntegration
- Automates FAssets operations
- Supports:
  - Automated minting/redeeming
  - DCA (Dollar Cost Averaging) strategies
  - Portfolio rebalancing
  - Cross-chain asset management

## Data Flow

```
User Creates Strategy
    ↓
AutomationHub stores strategy
    ↓
Off-chain Bot monitors triggers
    ↓
Trigger condition met (FTSO/FDC)
    ↓
Bot calls executeStrategy()
    ↓
SmartAccountExecutor executes gaslessly
    ↓
Action performed (swap, transfer, mint FAssets)
```

## Strategy Types

### 1. Price-Based Strategies
- **DCA Bot**: Buy FAssets when price dips
- **Take Profit**: Sell when price reaches target
- **Stop Loss**: Exit position on price drop

### 2. Event-Based Strategies
- **GitHub Rewards**: Tip contributors on milestones
- **Weather Insurance**: Auto-payout on weather events
- **Revenue Automation**: Convert business income to crypto

### 3. Time-Based Strategies
- **Recurring Buys**: Regular DCA purchases
- **Scheduled Rebalancing**: Periodic portfolio adjustments

### 4. Composite Strategies
- Multiple conditions combined with AND/OR logic
- Example: "Buy BTC when price < $50k AND GitHub repo hits 1k stars"

## Security Features

1. **Access Control**: Only strategy owners can modify their strategies
2. **Authorized Executors**: Whitelist of trusted bots
3. **Reentrancy Protection**: Guards against reentrancy attacks
4. **Max Executions**: Prevent runaway strategies
5. **Pausable**: Emergency stop mechanism

## Integration Points

### FTSO Integration
- Contract: `0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019` (Coston2)
- Provides real-time price feeds for 100+ assets
- Used for price triggers and conversions

### FDC Integration
- Verifies off-chain data through attestations
- Supports multiple data sources
- Cryptographic proof of events

### Smart Accounts
- Gasless transactions for users
- EIP-4337 compatible
- Signature-based execution

### FAssets
- Trustless Bitcoin, XRP, Dogecoin on Flare
- Automated minting/redeeming
- Cross-chain DeFi access

## Deployment

### Testnet (Coston2)
```bash
npx hardhat run scripts/deploy.js --network coston2
```

### Mainnet (Flare)
```bash
npx hardhat run scripts/deploy.js --network flare
```

## Future Enhancements

1. **Advanced Triggers**
   - Social media metrics (Twitter followers, etc.)
   - On-chain analytics (TVL, volume, etc.)
   - Multi-chain events

2. **Complex Actions**
   - Multi-step strategies
   - Conditional branching
   - Loop execution

3. **UI Improvements**
   - No-code strategy builder
   - Strategy marketplace
   - Performance analytics

4. **Optimization**
   - Gas optimization
   - Batch execution
   - Strategy templates
