// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Smart Account interface (simplified)
interface ISmartAccount {
    function executeCall(
        address target,
        uint256 value,
        bytes calldata data
    ) external returns (bytes memory);
}

/**
 * @title SmartAccountExecutor
 * @notice Handles gasless execution via Flare Smart Accounts
 * @dev Enables users to execute strategies without paying gas
 */
contract SmartAccountExecutor {
    
    struct GaslessExecution {
        address smartAccount;
        address target;
        bytes data;
        uint256 nonce;
        bytes signature;
    }
    
    mapping(address => uint256) public nonces;
    mapping(address => bool) public registeredSmartAccounts;
    
    event SmartAccountRegistered(address indexed smartAccount, address indexed owner);
    event GaslessExecutionCompleted(address indexed smartAccount, uint256 nonce);
    
    /**
     * @notice Register a Smart Account
     */
    function registerSmartAccount(address smartAccount) external {
        registeredSmartAccounts[smartAccount] = true;
        emit SmartAccountRegistered(smartAccount, msg.sender);
    }
    
    /**
     * @notice Execute strategy via Smart Account (gasless)
     */
    function executeViaSmartAccount(
        address smartAccount,
        address target,
        bytes calldata data,
        bytes calldata signature
    ) external returns (bytes memory) {
        require(registeredSmartAccounts[smartAccount], "Smart Account not registered");
        
        uint256 currentNonce = nonces[smartAccount];
        
        // Verify signature (simplified for hackathon)
        // In production, verify EIP-712 signature
        
        // Execute via Smart Account
        bytes memory result = ISmartAccount(smartAccount).executeCall(
            target,
            0,
            data
        );
        
        nonces[smartAccount]++;
        
        emit GaslessExecutionCompleted(smartAccount, currentNonce);
        
        return result;
    }
    
    /**
     * @notice Batch execute multiple strategies gaslessly
     */
    function batchExecute(
        address smartAccount,
        address[] calldata targets,
        bytes[] calldata dataArray
    ) external returns (bytes[] memory) {
        require(targets.length == dataArray.length, "Length mismatch");
        require(registeredSmartAccounts[smartAccount], "Smart Account not registered");
        
        bytes[] memory results = new bytes[](targets.length);
        
        for (uint256 i = 0; i < targets.length; i++) {
            results[i] = ISmartAccount(smartAccount).executeCall(
                targets[i],
                0,
                dataArray[i]
            );
        }
        
        return results;
    }
    
    /**
     * @notice Get current nonce for Smart Account
     */
    function getNonce(address smartAccount) external view returns (uint256) {
        return nonces[smartAccount];
    }
}
