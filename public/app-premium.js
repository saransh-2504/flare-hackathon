// ============================================
// FLARE AUTOPILOT - PREMIUM UI INTERACTIONS
// ============================================

let web3;
let account;
let userStrategies = [];
let mouseX = 0;
let mouseY = 0;
let cursorDot, cursorOutline;

// ============================================
// INITIALIZATION
// ============================================

window.addEventListener('load', () => {
    initCursor();
    initParticles();
    initFloatingBots();
    initCounters();
    loadUserStrategies();
    startSecurityMonitoring();
    
    if (window.ethereum && window.ethereum.selectedAddress) {
        connectWallet();
    }
});

// ============================================
// CUSTOM CURSOR
// ============================================

function initCursor() {
    cursorDot = document.getElementById('cursorDot');
    cursorOutline = document.getElementById('cursorOutline');
    
    let cursorX = 0;
    let cursorY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorX = e.clientX;
        cursorY = e.clientY;
    });
    
    // Smooth cursor animation with RAF
    function animateCursor() {
        // Dot follows cursor instantly
        cursorDot.style.left = cursorX + 'px';
        cursorDot.style.top = cursorY + 'px';
        
        // Outline follows with smooth easing
        outlineX += (cursorX - outlineX) * 0.15;
        outlineY += (cursorY - outlineY) * 0.15;
        
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Cursor effects on interactive elements
    const updateInteractiveElements = () => {
        const interactiveElements = document.querySelectorAll('button, a, .premium-card, input, select, .endpoint-item, .strategy-item');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.3)';
                cursorOutline.style.borderWidth = '3px';
            });
            
            el.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.borderWidth = '2px';
            });
        });
    };
    
    updateInteractiveElements();
    
    // Update interactive elements when DOM changes
    const observer = new MutationObserver(updateInteractiveElements);
    observer.observe(document.body, { childList: true, subtree: true });
}

// ============================================
// PARTICLE CANVAS
// ============================================

function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                this.x -= dx * force * 0.02;
                this.y -= dy * force * 0.02;
            }
            
            // Wrap around screen
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.fillStyle = `rgba(255, 107, 53, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.strokeStyle = `rgba(255, 107, 53, ${0.2 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ============================================
// FLOATING BOTS
// ============================================

function initFloatingBots() {
    const bots = [
        document.getElementById('bot1'),
        document.getElementById('bot2'),
        document.getElementById('bot3')
    ];
    
    bots.forEach((bot, index) => {
        // Initial position
        bot.style.left = Math.random() * (window.innerWidth - 100) + 'px';
        bot.style.top = Math.random() * (window.innerHeight - 100) + 'px';
        
        // Follow cursor with delay
        setInterval(() => {
            const currentX = parseFloat(bot.style.left);
            const currentY = parseFloat(bot.style.top);
            
            const targetX = mouseX - 30 + (index * 100);
            const targetY = mouseY - 30 + (index * 100);
            
            const newX = currentX + (targetX - currentX) * 0.05;
            const newY = currentY + (targetY - currentY) * 0.05;
            
            bot.style.left = newX + 'px';
            bot.style.top = newY + 'px';
            
            // Rotate based on movement
            const angle = Math.atan2(targetY - currentY, targetX - currentX) * (180 / Math.PI);
            bot.style.transform = `rotate(${angle}deg)`;
        }, 50);
    });
}

// ============================================
// ANIMATED COUNTERS
// ============================================

function initCounters() {
    updateDashboardStats();
}

function updateDashboardStats() {
    // Calculate real-time stats from user strategies
    const activeStrategies = userStrategies.filter(s => s.active).length;
    const totalExecutions = userStrategies.reduce((sum, s) => sum + (s.executions || 0), 0);
    const totalValueLocked = userStrategies.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);
    
    // Update counters with animation
    animateCounter(document.querySelector('.stat-card:nth-child(1) .stat-value'), activeStrategies);
    animateCounter(document.querySelector('.stat-card:nth-child(2) .stat-value span'), totalValueLocked);
    animateCounter(document.querySelector('.stat-card:nth-child(3) .stat-value'), totalExecutions);
}

function animateCounter(element, target) {
    if (!element) return;
    
    const duration = 1500;
    const start = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;
    
    const updateCounter = () => {
        current += increment;
        if ((increment > 0 && current < target) || (increment < 0 && current > target)) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = Math.floor(target).toLocaleString();
        }
    };
    
    updateCounter();
}

// ============================================
// WALLET CONNECTION
// ============================================

async function connectWallet() {
    try {
        if (typeof window.ethereum === 'undefined') {
            showNotification('error', 'MetaMask Not Found', 'Please install MetaMask to continue');
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

        const btn = document.getElementById('connectBtn');
        btn.innerHTML = `
            <span class="btn-icon">✅</span>
            <span class="btn-text">${account.slice(0, 6)}...${account.slice(-4)}</span>
            <div class="btn-glow"></div>
        `;
        btn.style.background = 'linear-gradient(135deg, #00F5A0, #00D9FF)';
        
        showNotification('success', 'Wallet Connected', 'Successfully connected to Flare Coston2');
        
        loadUserStrategies();
        
    } catch (error) {
        showNotification('error', 'Connection Failed', error.message);
    }
}

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
                showNotification('error', 'Network Error', 'Failed to add Coston2 network');
            }
        }
    }
}

// ============================================
// STRATEGY MANAGEMENT
// ============================================

function createStrategy(event) {
    event.preventDefault();
    
    if (!account) {
        showNotification('warning', 'Wallet Required', 'Please connect your wallet first');
        return;
    }

    const triggerType = document.getElementById('triggerType').value;
    const asset = document.getElementById('asset').value;
    const condition = document.getElementById('condition').value;
    const targetPrice = document.getElementById('targetPrice').value;
    const action = document.getElementById('action').value;
    const amount = document.getElementById('amount').value;
    const protected = document.getElementById('protected').checked;

    const strategy = {
        id: Date.now(),
        triggerType,
        asset,
        condition,
        targetPrice,
        action,
        amount,
        protected,
        active: true,
        executions: 0,
        createdAt: new Date().toISOString()
    };

    userStrategies.push(strategy);
    localStorage.setItem('strategies', JSON.stringify(userStrategies));
    
    displayStrategies();
    updateDashboardStats();
    event.target.reset();
    
    showNotification('success', 'Strategy Created', `Your ${asset} automation strategy is now active`);
}

function loadUserStrategies() {
    const stored = localStorage.getItem('strategies');
    if (stored) {
        userStrategies = JSON.parse(stored);
        displayStrategies();
        updateDashboardStats();
    }
}

function displayStrategies() {
    const container = document.getElementById('strategiesList');
    
    if (userStrategies.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <p>No strategies yet</p>
                <span>Create your first automation strategy</span>
            </div>
        `;
        return;
    }
    
    container.innerHTML = userStrategies.map(strategy => `
        <div class="strategy-item">
            <div class="strategy-header">
                <div class="strategy-info">
                    <h4>${strategy.asset} ${strategy.action.toUpperCase()}</h4>
                    <div class="strategy-meta">
                        ${strategy.triggerType} • Created ${new Date(strategy.createdAt).toLocaleDateString()}
                    </div>
                </div>
                <div class="strategy-status">
                    ${strategy.active ? '● Active' : '○ Paused'}
                </div>
            </div>
            
            <div class="strategy-details">
                <div class="detail-item">
                    <div class="detail-label">Condition</div>
                    <div class="detail-value">${strategy.condition} $${strategy.targetPrice}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Amount</div>
                    <div class="detail-value">$${strategy.amount}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Executions</div>
                    <div class="detail-value">${strategy.executions}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Protected</div>
                    <div class="detail-value">${strategy.protected ? '🛡️ Yes' : 'No'}</div>
                </div>
            </div>
            
            <div class="strategy-actions">
                <button class="btn-secondary" onclick="toggleStrategy(${strategy.id})">
                    ${strategy.active ? 'Pause' : 'Resume'}
                </button>
                <button class="btn-secondary btn-danger" onclick="deleteStrategy(${strategy.id})">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

function toggleStrategy(id) {
    const strategy = userStrategies.find(s => s.id === id);
    if (strategy) {
        strategy.active = !strategy.active;
        localStorage.setItem('strategies', JSON.stringify(userStrategies));
        displayStrategies();
        updateDashboardStats();
        showNotification('success', 'Strategy Updated', `Strategy ${strategy.active ? 'activated' : 'paused'}`);
    }
}

function deleteStrategy(id) {
    userStrategies = userStrategies.filter(s => s.id !== id);
    localStorage.setItem('strategies', JSON.stringify(userStrategies));
    displayStrategies();
    updateDashboardStats();
    showNotification('success', 'Strategy Deleted', 'Strategy removed successfully');
}

function refreshStrategies() {
    loadUserStrategies();
    updateDashboardStats();
    showNotification('success', 'Refreshed', 'Strategies updated');
}

// ============================================
// SECURITY MONITORING
// ============================================

function startSecurityMonitoring() {
    // Simulate security monitoring
    setInterval(() => {
        const threats = Math.floor(Math.random() * 3);
        const blocked = Math.floor(Math.random() * 10);
        
        document.getElementById('threatsDetected').textContent = threats;
        document.getElementById('blockedAttacks').textContent = blocked;
        
        const threatLevel = document.getElementById('threatLevel');
        if (threats === 0) {
            threatLevel.innerHTML = '<span class="threat-dot"></span><span>SAFE</span>';
            threatLevel.style.background = 'rgba(0, 245, 160, 0.1)';
            threatLevel.style.borderColor = 'rgba(0, 245, 160, 0.2)';
            threatLevel.style.color = '#00F5A0';
        } else if (threats < 2) {
            threatLevel.innerHTML = '<span class="threat-dot"></span><span>LOW</span>';
            threatLevel.style.background = 'rgba(255, 214, 10, 0.1)';
            threatLevel.style.borderColor = 'rgba(255, 214, 10, 0.2)';
            threatLevel.style.color = '#FFD60A';
        } else {
            threatLevel.innerHTML = '<span class="threat-dot"></span><span>MEDIUM</span>';
            threatLevel.style.background = 'rgba(255, 107, 53, 0.1)';
            threatLevel.style.borderColor = 'rgba(255, 107, 53, 0.2)';
            threatLevel.style.color = '#FF6B35';
        }
    }, 5000);
}

// ============================================
// API KEY GENERATION
// ============================================

let generatedApiKey = null;

async function generateApiKey() {
    const email = document.getElementById('apiEmail').value;
    const wallet = document.getElementById('apiWallet').value;
    
    if (!email || !wallet) {
        showNotification('warning', 'Missing Information', 'Please enter both email and wallet address');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('error', 'Invalid Email', 'Please enter a valid email address');
        return;
    }
    
    // Validate wallet address format
    if (!wallet.startsWith('0x') || wallet.length !== 42) {
        showNotification('error', 'Invalid Wallet', 'Please enter a valid Flare wallet address');
        return;
    }
    
    try {
        const apiUrl = window.FLARE_CONFIG ? window.FLARE_CONFIG.API_URL : 'http://localhost:3000/api';
        
        const response = await fetch(`${apiUrl}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                walletAddress: wallet,
                name: 'Flare User'
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            generatedApiKey = data.apiKey;
            document.getElementById('apiKeyValue').textContent = generatedApiKey;
            document.getElementById('apiKeyDisplay').style.display = 'block';
            showNotification('success', 'API Key Generated', 'Your API key has been created successfully');
        } else {
            throw new Error(data.message || 'Failed to generate API key');
        }
    } catch (error) {
        // Generate a mock API key for demo purposes
        generatedApiKey = 'flr_' + Array.from({length: 64}, () => 
            Math.floor(Math.random() * 16).toString(16)).join('');
        
        document.getElementById('apiKeyValue').textContent = generatedApiKey;
        document.getElementById('apiKeyDisplay').style.display = 'block';
        
        // Store in localStorage
        localStorage.setItem('apiKey', generatedApiKey);
        localStorage.setItem('apiEmail', email);
        localStorage.setItem('apiWallet', wallet);
        
        showNotification('success', 'API Key Generated', 'Your API key has been created (Demo Mode)');
    }
}

function copyApiKey() {
    if (generatedApiKey) {
        navigator.clipboard.writeText(generatedApiKey).then(() => {
            showNotification('success', 'Copied!', 'API key copied to clipboard');
        }).catch(() => {
            showNotification('error', 'Copy Failed', 'Could not copy to clipboard');
        });
    }
}

function toggleApiDocs() {
    const mainContainer = document.querySelector('.main-container');
    const docsOverlay = document.getElementById('docsFullPageOverlay');
    
    if (!docsOverlay) {
        // Create full-page docs overlay
        const overlay = document.createElement('div');
        overlay.id = 'docsFullPageOverlay';
        overlay.className = 'docs-fullpage-overlay';
        overlay.innerHTML = `
            <div class="docs-header">
                <button class="btn-back" onclick="toggleApiDocs()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M19 12H5M12 19l-7-7 7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Back to Dashboard</span>
                </button>
                <div class="docs-title">
                    <span class="docs-icon">📚</span>
                    <h2>API Documentation</h2>
                </div>
            </div>
            <div class="docs-content-wrapper">
                <div class="docs-loading" id="docsLoadingFull">
                    <div class="loading-spinner"></div>
                    <p>Loading documentation...</p>
                </div>
                <iframe id="apiDocsFrameFull" style="display: none;"></iframe>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Load docs
        setTimeout(() => {
            const frame = document.getElementById('apiDocsFrameFull');
            const loading = document.getElementById('docsLoadingFull');
            
            frame.src = 'api-docs.html';
            frame.onload = () => {
                loading.style.display = 'none';
                frame.style.display = 'block';
                frame.style.animation = 'fadeIn 0.5s ease';
            };
        }, 300);
        
        // Show overlay with animation
        setTimeout(() => overlay.classList.add('active'), 10);
        document.body.style.overflow = 'hidden';
    } else {
        // Hide overlay
        docsOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            docsOverlay.remove();
        }, 400);
    }
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(type, title, message) {
    const container = document.getElementById('notificationContainer');
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">${icons[type]}</div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 5000);
}

// ============================================
// FORM UI UPDATES
// ============================================

function updateFormUI() {
    const triggerType = document.getElementById('triggerType').value;
    // Add any trigger-specific UI updates here
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add slide-out animation
const slideOutRight = `
    @keyframes slideOutRight {
        to {
            opacity: 0;
            transform: translateX(400px);
        }
    }
`;

const style = document.createElement('style');
style.textContent = slideOutRight;
document.head.appendChild(style);
