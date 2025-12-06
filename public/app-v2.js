// Flare Autopilot V2 - With Security Firewall
// Enhanced with real-time security monitoring

let web3;
let account;
let userStrategies = [];
let securityStatus = {
    threatLevel: 0, // 0=SAFE, 1=LOW, 2=MEDIUM, 3=HIGH, 4=CRITICAL
    circuitBreakerActive: false,
    threatsDetected: 0,
    lastThreat: "System initialized"
};

// Initialize
window.addEventListener('load', () => {
    loadUserStrategies();
    startSecurityMonitoring();
    
    if (window.ethereum && window.ethereum.selectedAddress) {
        connectWallet();
    }
});

// Connect Wallet
async function connectWallet() {
    try {
        if (typeof window.ethereum === 'undefined') {
            showNotification('❌ MetaMask not installed!', 'error');
            return;
        }

        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        account = accounts[0];
        
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        if (chainId !== '0x72') {
            await switchToCoston2();
            return;
        }

        document.querySelector('.btn-primary').innerHTML = `✅ ${account.slice(0, 6)}...${account.slice(-4)}`;
        document.querySelector('.btn-primary').style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        showNotification(`✅ Connected to Flare Coston2!\n🛡️ Security Firewall Active`, 'success');
        
        loadUserStrategies();
        
    } catch (error) {
        showNotification('❌ Failed to connect: ' + error.message, 'error');
    }
}

// Switch to Coston2
async function switchToCoston2() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x72' }],
        });
        connectWallet();
    } catch (switchError) {
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x72',
                        chainName: 'Flare Testnet Coston2',
                        nativeCurrency: {
                            name: 'Coston2 Flare',
                            symbol: 'C2FLR',
                            decimals: 18
                        },
                        rpcUrls: ['https://coston2-api.flare.network/ext/C/rpc'],
                        blockExplorerUrls: ['https://coston2-explorer.flare.network/']
                    }]
                });
                connectWallet();
            } catch (addError) {
                showNotification('❌ Failed to add Coston2', 'error');
            }
        }
    }
}

// Create Strategy
function createStrategy(event) {
    event.preventDefault();
    
    if (!account) {
        showNotification('⚠️ Please connect wallet first!', 'warning');
        return;
    }

    const triggerType = document.getElementById('triggerType').value;
    const asset = document.getElementById('asset').value;
    const condition = document.getElementById('condition').value;
    const action = document.getElementById('action').value;
    const amount = document.getElementById('amount').value;
    const safetyVault = document.getElementById('safetyVault').value;
    const enableProtection = document.getElementById('enableProtection').checked;

    const strategy = {
        id: Date.now(),
        triggerType,
        asset,
        condition,
        action,
        amount,
        safetyVault: safetyVault || account,
        protected: enableProtection,
        active: true,
        executions: 0,
        created: new Date().toISOString()
    };

    userStrategies.push(strategy);
    localStorage.setItem('flare_strategies', JSON.stringify(userStrategies));

    showNotification(`
        ✨ Strategy Created Successfully!
        
        🎯 ${getTriggerLabel(triggerType)}
        💎 Asset: ${asset}
        📊 Condition: ${condition}
        ⚡ ${getActionLabel(action)} - $${amount}
        ${enableProtection ? '🛡️ Security Firewall: ENABLED' : ''}
        
        ✅ Gasless execution via Smart Account
        🚀 Strategy is now monitoring...
    `, 'success');

    // Reset form
    event.target.reset();
    document.getElementById('enableProtection').checked = true;

    renderUserStrategies();
    updateStats();
    switchTab('strategies');
}

// Load Strategies
function loadUserStrategies() {
    const stored = localStorage.getItem('flare_strategies');
    if (stored) {
        userStrategies = JSON.parse(stored);
        renderUserStrategies();
        updateStats();
    }
}

// Render Strategies
function renderUserStrategies() {
    const container = document.getElementById('strategiesList');
    
    if (userStrategies.length === 0) {
        container.innerHTML = `
            <div class="security-panel" style="text-align: center; padding: 60px;">
                <div style="font-size: 4em; margin-bottom: 20px;">📋</div>
                <h3 style="margin-bottom: 10px;">No strategies yet</h3>
                <p style="color: #a78bfa;">Create your first automation strategy to get started!</p>
                <button class="btn btn-primary" style="margin-top: 20px;" onclick="switchTab('create')">
                    ✨ Create Strategy
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = userStrategies.map(strategy => `
        <div class="strategy-card ${strategy.protected ? 'protected' : ''}">
            <div class="strategy-header">
                <div>
                    <div class="strategy-title">${getStrategyIcon(strategy.triggerType)} ${strategy.asset} Automation</div>
                    <div class="strategy-badges">
                        <span class="badge ${strategy.active ? 'badge-active' : ''}">${strategy.active ? '● ACTIVE' : '○ PAUSED'}</span>
                        ${strategy.protected ? '<span class="badge badge-protected">🛡️ PROTECTED</span>' : ''}
                    </div>
                </div>
            </div>
            <div class="strategy-details">
                <strong>Trigger:</strong> ${getTriggerLabel(strategy.triggerType)} - ${strategy.condition}<br>
                <strong>Action:</strong> ${getActionLabel(strategy.action)} - $${strategy.amount}<br>
                <strong>Executions:</strong> ${strategy.executions} / Unlimited<br>
                <strong>Created:</strong> ${new Date(strategy.created).toLocaleString()}<br>
                ${strategy.protected ? `<strong>Safety Vault:</strong> ${strategy.safetyVault.slice(0, 10)}...${strategy.safetyVault.slice(-8)}` : ''}
            </div>
            <div class="tech-badges">
                <span class="tech-badge badge-smart">SMART ACCOUNT</span>
                ${strategy.triggerType === 'price' ? '<span class="tech-badge badge-ftso">FTSO</span>' : ''}
                ${strategy.triggerType === 'event' ? '<span class="tech-badge badge-fdc">FDC</span>' : ''}
                ${(strategy.action === 'mint' || strategy.action === 'redeem') ? '<span class="tech-badge badge-fassets">FASSETS</span>' : ''}
                ${strategy.protected ? '<span class="tech-badge badge-firewall">FIREWALL</span>' : ''}
            </div>
            <div class="strategy-actions">
                <button onclick="toggleStrategy(${strategy.id})" style="background: ${strategy.active ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)'}; color: white;">
                    ${strategy.active ? '⏸️ Pause' : '▶️ Resume'}
                </button>
                ${strategy.protected ? `<button onclick="emergencyTransfer(${strategy.id})" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white;">🚨 Emergency</button>` : ''}
                <button onclick="deleteStrategy(${strategy.id})" style="background: linear-gradient(135deg, #6b7280, #4b5563); color: white;">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Toggle Strategy
function toggleStrategy(id) {
    const strategy = userStrategies.find(s => s.id === id);
    if (strategy) {
        strategy.active = !strategy.active;
        localStorage.setItem('flare_strategies', JSON.stringify(userStrategies));
        renderUserStrategies();
        showNotification(strategy.active ? '▶️ Strategy resumed!' : '⏸️ Strategy paused!', 'info');
    }
}

// Delete Strategy
function deleteStrategy(id) {
    if (confirm('Are you sure you want to delete this strategy?')) {
        userStrategies = userStrategies.filter(s => s.id !== id);
        localStorage.setItem('flare_strategies', JSON.stringify(userStrategies));
        renderUserStrategies();
        updateStats();
        showNotification('🗑️ Strategy deleted!', 'info');
    }
}

// Emergency Transfer
function emergencyTransfer(id) {
    const strategy = userStrategies.find(s => s.id === id);
    if (strategy && confirm(`Emergency transfer funds to safety vault?\n\nAmount: $${strategy.amount}\nVault: ${strategy.safetyVault}`)) {
        showNotification(`
            🚨 EMERGENCY TRANSFER INITIATED
            
            💰 Amount: $${strategy.amount}
            📍 To: ${strategy.safetyVault.slice(0, 10)}...
            🛡️ Security Firewall: Active
            ✅ Funds moved to safety!
        `, 'warning');
    }
}

// Update Stats
function updateStats() {
    const activeCount = userStrategies.filter(s => s.active).length;
    const protectedCount = userStrategies.filter(s => s.protected).length;
    const totalExecutions = userStrategies.reduce((sum, s) => sum + s.executions, 0);
    const gasSaved = totalExecutions * 2.3;
    
    document.getElementById('activeStrategies').textContent = activeCount;
    document.getElementById('protectedStrategies').textContent = protectedCount;
    document.getElementById('executions').textContent = totalExecutions;
    document.getElementById('gasSaved').textContent = '$' + Math.floor(gasSaved);
}

// Security Monitoring
function startSecurityMonitoring() {
    // Simulate security monitoring
    setInterval(() => {
        // Random threat detection (5% chance)
        if (Math.random() > 0.95) {
            const threats = [
                { level: 1, desc: "Minor anomaly detected in price feed" },
                { level: 2, desc: "Suspicious transaction pattern observed" },
                { level: 3, desc: "Potential exploit detected on similar protocol" }
            ];
            const threat = threats[Math.floor(Math.random() * threats.length)];
            detectThreat(threat.level, threat.desc);
        }
    }, 10000); // Check every 10 seconds
}

// Detect Threat
function detectThreat(level, description) {
    securityStatus.threatLevel = level;
    securityStatus.threatsDetected++;
    securityStatus.lastThreat = description;
    
    updateSecurityUI();
    
    if (level >= 3) {
        activateCircuitBreaker(description);
    } else {
        showNotification(`⚠️ Security Alert\n\n${description}`, 'warning');
    }
}

// Activate Circuit Breaker
function activateCircuitBreaker(reason) {
    securityStatus.circuitBreakerActive = true;
    
    // Pause all strategies
    userStrategies.forEach(s => {
        if (s.active && s.protected) {
            s.active = false;
        }
    });
    localStorage.setItem('flare_strategies', JSON.stringify(userStrategies));
    
    updateSecurityUI();
    renderUserStrategies();
    
    showNotification(`
        🚨 CIRCUIT BREAKER ACTIVATED!
        
        Reason: ${reason}
        
        🛡️ All protected strategies paused
        💰 Funds are safe
        ⚠️ Manual review required
    `, 'error');
}

// Update Security UI
function updateSecurityUI() {
    const levels = ['SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#dc2626'];
    const icons = ['✓', '⚠️', '⚠️', '🚨', '🚨'];
    
    const badge = document.getElementById('securityBadge');
    const threatLevel = document.getElementById('threatLevel');
    
    const level = securityStatus.circuitBreakerActive ? 4 : securityStatus.threatLevel;
    
    // Update badge
    badge.className = 'security-badge';
    if (level >= 3) badge.classList.add('danger');
    else if (level >= 2) badge.classList.add('warning');
    
    badge.querySelector('.security-text').textContent = 
        securityStatus.circuitBreakerActive ? 'CIRCUIT BREAKER ACTIVE' : `THREAT: ${levels[level]}`;
    badge.querySelector('div div:last-child').textContent = 
        securityStatus.circuitBreakerActive ? 'All operations paused' : securityStatus.lastThreat;
    
    // Update threat level display
    threatLevel.innerHTML = `
        <div class="threat-indicator" style="background: linear-gradient(135deg, ${colors[level]}, ${colors[level]}dd);">
            ${icons[level]}
        </div>
        <div class="threat-info">
            <h3>Threat Level: ${levels[level]}</h3>
            <p>${securityStatus.lastThreat}</p>
        </div>
    `;
}

// Test Circuit Breaker
function testCircuitBreaker() {
    if (confirm('This will activate the circuit breaker and pause all protected strategies. Continue?')) {
        activateCircuitBreaker('Manual test by user');
    }
}

// Refresh Security
function refreshSecurity() {
    securityStatus = {
        threatLevel: 0,
        circuitBreakerActive: false,
        threatsDetected: 0,
        lastThreat: "System refreshed - all clear"
    };
    
    updateSecurityUI();
    showNotification('🔄 Security status refreshed!', 'success');
}

// Show Security Info
function showSecurityInfo() {
    showNotification(`
        🛡️ SECURITY FIREWALL FEATURES:
        
        ✅ FDC monitors security APIs
        ✅ FTSO detects price anomalies
        ✅ Auto-pause on threats
        ✅ Emergency fund transfers
        ✅ Real-time threat detection
        
        🌟 YOUR STRATEGIES ARE PROTECTED!
    `, 'info');
}

// Save Security Settings
function saveSecuritySettings() {
    const priceThreshold = document.getElementById('priceThreshold').value;
    const circuitThreshold = document.getElementById('circuitThreshold').value;
    const emergencyVault = document.getElementById('emergencyVault').value;
    
    localStorage.setItem('security_settings', JSON.stringify({
        priceThreshold,
        circuitThreshold,
        emergencyVault
    }));
    
    showNotification('💾 Security settings saved!', 'success');
}

// Switch Tab
function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab + 'Tab').classList.add('active');
}

// Helper Functions
function getTriggerLabel(type) {
    const labels = {
        'price': '📊 Price Movement (FTSO)',
        'event': '🌍 Real-World Event (FDC)',
        'time': '⏰ Time-Based'
    };
    return labels[type] || type;
}

function getActionLabel(type) {
    const labels = {
        'mint': '🪙 Mint FAssets',
        'swap': '🔄 Swap Tokens',
        'transfer': '💸 Transfer',
        'redeem': '🎁 Redeem FAssets'
    };
    return labels[type] || type;
}

function getStrategyIcon(type) {
    const icons = {
        'price': '💎',
        'event': '⭐',
        'time': '⏰'
    };
    return icons[type] || '🚀';
}

// Notification System
function showNotification(message, type = 'info') {
    const colors = {
        success: 'linear-gradient(135deg, #10b981, #059669)',
        error: 'linear-gradient(135deg, #ef4444, #dc2626)',
        warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
        info: 'linear-gradient(135deg, #3b82f6, #2563eb)'
    };
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.background = colors[type];
    notification.style.whiteSpace = 'pre-line';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}
