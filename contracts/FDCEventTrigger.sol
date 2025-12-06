// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FDCEventTrigger
 * @notice Handles FDC (Flare Data Connector) event-based triggers
 * @dev Verifies real-world events through FDC attestations
 */
contract FDCEventTrigger {
    
    // FDC Attestation types
    enum EventType {
        GITHUB_STARS,      // GitHub repo stars milestone
        WEATHER_DATA,      // Weather API data
        API_WEBHOOK,       // Generic API webhook
        PAYMENT_RECEIVED,  // Payment confirmation (Stripe, etc.)
        CUSTOM            // Custom event type
    }
    
    struct EventTrigger {
        EventType eventType;
        bytes32 eventIdentifier;  // Hash of event details
        uint256 threshold;        // Threshold value (e.g., 1000 stars)
        bool triggered;
        bytes attestationData;    // FDC attestation proof
    }
    
    mapping(uint256 => EventTrigger) public eventTriggers;
    
    // Authorized FDC verifiers
    mapping(address => bool) public fdcVerifiers;
    
    event EventTriggerCreated(uint256 indexed strategyId, EventType eventType);
    event EventVerified(uint256 indexed strategyId, bytes32 eventIdentifier);
    event FDCVerifierAdded(address indexed verifier);
    
    modifier onlyFDCVerifier() {
        require(fdcVerifiers[msg.sender], "Not authorized FDC verifier");
        _;
    }
    
    /**
     * @notice Create an event trigger
     */
    function createEventTrigger(
        uint256 strategyId,
        EventType eventType,
        bytes32 eventIdentifier,
        uint256 threshold
    ) external {
        eventTriggers[strategyId] = EventTrigger({
            eventType: eventType,
            eventIdentifier: eventIdentifier,
            threshold: threshold,
            triggered: false,
            attestationData: ""
        });
        
        emit EventTriggerCreated(strategyId, eventType);
    }
    
    /**
     * @notice Verify and trigger event (called by FDC verifier)
     */
    function verifyEvent(
        uint256 strategyId,
        bytes calldata attestationData
    ) external onlyFDCVerifier {
        EventTrigger storage trigger = eventTriggers[strategyId];
        require(!trigger.triggered, "Already triggered");
        
        // In production, verify FDC attestation proof here
        // For hackathon, simplified verification
        
        trigger.triggered = true;
        trigger.attestationData = attestationData;
        
        emit EventVerified(strategyId, trigger.eventIdentifier);
    }
    
    /**
     * @notice Check if event trigger is met
     */
    function checkEventTrigger(uint256 strategyId) external view returns (bool) {
        return eventTriggers[strategyId].triggered;
    }
    
    /**
     * @notice Add FDC verifier
     */
    function addFDCVerifier(address verifier) external {
        fdcVerifiers[verifier] = true;
        emit FDCVerifierAdded(verifier);
    }
    
    /**
     * @notice Get event trigger details
     */
    function getEventTrigger(uint256 strategyId) 
        external view returns (
            EventType eventType,
            bytes32 eventIdentifier,
            uint256 threshold,
            bool triggered
        ) 
    {
        EventTrigger memory trigger = eventTriggers[strategyId];
        return (
            trigger.eventType,
            trigger.eventIdentifier,
            trigger.threshold,
            trigger.triggered
        );
    }
}
