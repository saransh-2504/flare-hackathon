/**
 * Local API Testing Script
 * Tests all API endpoints before deployment
 */

const http = require('http');

const API_URL = 'http://localhost:3000';
let apiKey = '';

console.log('🧪 Testing Flare Autopilot API...\n');
console.log('⚠️  Make sure API server is running: npm start\n');

// Helper function to make requests
function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, API_URL);
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (apiKey) {
            options.headers['X-API-Key'] = apiKey;
        }

        const req = http.request(url, options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        data: JSON.parse(body)
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: body
                    });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

// Test suite
async function runTests() {
    let passed = 0;
    let failed = 0;

    try {
        // Test 1: Health Check
        console.log('1️⃣  Testing health endpoint...');
        const health = await makeRequest('GET', '/api/health');
        if (health.status === 200 && health.data.status === 'healthy') {
            console.log('   ✅ Health check passed');
            passed++;
        } else {
            console.log('   ❌ Health check failed');
            failed++;
        }

        // Test 2: API Docs
        console.log('\n2️⃣  Testing docs endpoint...');
        const docs = await makeRequest('GET', '/api/docs');
        if (docs.status === 200 && docs.data.name) {
            console.log('   ✅ Docs endpoint passed');
            passed++;
        } else {
            console.log('   ❌ Docs endpoint failed');
            failed++;
        }

        // Test 3: Register and get API key
        console.log('\n3️⃣  Testing API key registration...');
        const register = await makeRequest('POST', '/api/auth/register', {
            email: 'test@example.com',
            walletAddress: '0x1234567890123456789012345678901234567890',
            name: 'Test User'
        });
        
        if (register.status === 200 && register.data.apiKey) {
            apiKey = register.data.apiKey;
            console.log('   ✅ API key registration passed');
            console.log(`   🔑 API Key: ${apiKey.substring(0, 20)}...`);
            passed++;
        } else {
            console.log('   ❌ API key registration failed');
            failed++;
            return; // Can't continue without API key
        }

        // Test 4: Get API key info
        console.log('\n4️⃣  Testing API key info...');
        const keyInfo = await makeRequest('GET', '/api/auth/key');
        if (keyInfo.status === 200 && keyInfo.data.email) {
            console.log('   ✅ API key info passed');
            passed++;
        } else {
            console.log('   ❌ API key info failed');
            failed++;
        }

        // Test 5: Create strategy
        console.log('\n5️⃣  Testing strategy creation...');
        const strategy = await makeRequest('POST', '/api/strategies', {
            triggerType: 'price',
            asset: 'BTC',
            condition: 'below',
            action: 'mint',
            amount: '100',
            protected: true
        });
        
        let strategyId = '';
        if (strategy.status === 200 && strategy.data.id) {
            strategyId = strategy.data.id;
            console.log('   ✅ Strategy creation passed');
            console.log(`   📋 Strategy ID: ${strategyId}`);
            passed++;
        } else {
            console.log('   ❌ Strategy creation failed');
            failed++;
        }

        // Test 6: List strategies
        console.log('\n6️⃣  Testing strategy listing...');
        const strategies = await makeRequest('GET', '/api/strategies');
        if (strategies.status === 200 && strategies.data.length > 0) {
            console.log('   ✅ Strategy listing passed');
            console.log(`   📊 Found ${strategies.data.length} strategy(ies)`);
            passed++;
        } else {
            console.log('   ❌ Strategy listing failed');
            failed++;
        }

        // Test 7: Get strategy by ID
        if (strategyId) {
            console.log('\n7️⃣  Testing get strategy by ID...');
            const getStrategy = await makeRequest('GET', `/api/strategies/${strategyId}`);
            if (getStrategy.status === 200 && getStrategy.data.id === strategyId) {
                console.log('   ✅ Get strategy passed');
                passed++;
            } else {
                console.log('   ❌ Get strategy failed');
                failed++;
            }
        }

        // Test 8: Security status
        console.log('\n8️⃣  Testing security status...');
        const security = await makeRequest('GET', '/api/security/status');
        if (security.status === 200 && security.data.threatLevel) {
            console.log('   ✅ Security status passed');
            console.log(`   🛡️  Threat Level: ${security.data.threatLevel}`);
            passed++;
        } else {
            console.log('   ❌ Security status failed');
            failed++;
        }

        // Test 9: Check address security
        console.log('\n9️⃣  Testing address security check...');
        const addressCheck = await makeRequest('POST', '/api/security/check', {
            address: '0x1234567890123456789012345678901234567890'
        });
        if (addressCheck.status === 200 && addressCheck.data.address) {
            console.log('   ✅ Address security check passed');
            console.log(`   🔍 Risk Level: ${addressCheck.data.riskLevel}`);
            passed++;
        } else {
            console.log('   ❌ Address security check failed');
            failed++;
        }

        // Test 10: Get FTSO price
        console.log('\n🔟 Testing FTSO price endpoint...');
        const price = await makeRequest('GET', '/api/ftso/price/BTC');
        if (price.status === 200 && price.data.price) {
            console.log('   ✅ FTSO price passed');
            console.log(`   💰 BTC Price: $${price.data.price}`);
            passed++;
        } else {
            console.log('   ❌ FTSO price failed');
            failed++;
        }

        // Test 11: Get multiple prices
        console.log('\n1️⃣1️⃣  Testing multiple prices...');
        const prices = await makeRequest('GET', '/api/ftso/prices?symbols=BTC,ETH,FLR');
        if (prices.status === 200 && prices.data.length === 3) {
            console.log('   ✅ Multiple prices passed');
            prices.data.forEach(p => {
                console.log(`   💰 ${p.symbol}: $${p.price}`);
            });
            passed++;
        } else {
            console.log('   ❌ Multiple prices failed');
            failed++;
        }

        // Test 12: Delete strategy
        if (strategyId) {
            console.log('\n1️⃣2️⃣  Testing strategy deletion...');
            const deleteStrategy = await makeRequest('DELETE', `/api/strategies/${strategyId}`);
            if (deleteStrategy.status === 200) {
                console.log('   ✅ Strategy deletion passed');
                passed++;
            } else {
                console.log('   ❌ Strategy deletion failed');
                failed++;
            }
        }

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ Passed: ${passed}/12`);
        console.log(`❌ Failed: ${failed}/12`);
        
        if (failed === 0) {
            console.log('\n🎉 ALL TESTS PASSED!');
            console.log('✅ API is ready for deployment!');
        } else {
            console.log('\n⚠️  Some tests failed. Check API server.');
        }

    } catch (error) {
        console.error('\n❌ Error running tests:', error.message);
        console.log('\n⚠️  Make sure API server is running:');
        console.log('   npm start');
    }
}

// Run tests
runTests();
