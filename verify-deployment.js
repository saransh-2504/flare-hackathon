/**
 * Vercel Deployment Verification Script
 * Tests all critical components before deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Vercel Deployment Readiness...\n');

let errors = [];
let warnings = [];
let passed = 0;

// Test 1: Check vercel.json exists and is valid
console.log('✓ Checking vercel.json...');
try {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    // Accept both old format (builds/routes) and new format (rewrites/functions)
    if ((!vercelConfig.builds && !vercelConfig.rewrites) || (!vercelConfig.routes && !vercelConfig.rewrites)) {
        errors.push('vercel.json missing builds/routes or rewrites');
    } else {
        passed++;
        console.log('  ✅ vercel.json is valid');
    }
} catch (e) {
    errors.push('vercel.json is invalid or missing: ' + e.message);
}

// Test 2: Check package.json has required dependencies
console.log('\n✓ Checking package.json...');
try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const required = ['express', 'cors', 'ethers'];
    const missing = required.filter(dep => !pkg.dependencies[dep]);
    
    if (missing.length > 0) {
        errors.push('Missing dependencies: ' + missing.join(', '));
    } else {
        passed++;
        console.log('  ✅ All required dependencies present');
    }
    
    if (!pkg.scripts['vercel-build']) {
        warnings.push('No vercel-build script found');
    }
} catch (e) {
    errors.push('package.json is invalid: ' + e.message);
}

// Test 3: Check API server exports correctly
console.log('\n✓ Checking API server...');
try {
    const apiContent = fs.readFileSync('api/server.js', 'utf8');
    if (!apiContent.includes('module.exports')) {
        errors.push('api/server.js must export app for Vercel');
    } else {
        passed++;
        console.log('  ✅ API server exports correctly');
    }
} catch (e) {
    errors.push('api/server.js not found: ' + e.message);
}

// Test 4: Check frontend files exist
console.log('\n✓ Checking frontend files...');
const frontendFiles = [
    'frontend/index-ultra.html',
    'frontend/styles-v3.css',
    'frontend/app-v2.js',
    'frontend/config.js'
];

let frontendOk = true;
frontendFiles.forEach(file => {
    if (!fs.existsSync(file)) {
        errors.push(`Missing frontend file: ${file}`);
        frontendOk = false;
    }
});

if (frontendOk) {
    passed++;
    console.log('  ✅ All frontend files present');
}

// Test 5: Check config.js has environment detection
console.log('\n✓ Checking config.js...');
try {
    const configContent = fs.readFileSync('frontend/config.js', 'utf8');
    if (!configContent.includes('window.location.hostname')) {
        warnings.push('config.js may not detect environment correctly');
    } else {
        passed++;
        console.log('  ✅ Config has environment detection');
    }
} catch (e) {
    errors.push('config.js not found: ' + e.message);
}

// Test 6: Check .vercelignore exists
console.log('\n✓ Checking .vercelignore...');
if (fs.existsSync('.vercelignore')) {
    passed++;
    console.log('  ✅ .vercelignore exists');
} else {
    warnings.push('.vercelignore not found - may deploy unnecessary files');
}

// Test 7: Check contracts are compiled
console.log('\n✓ Checking compiled contracts...');
if (fs.existsSync('artifacts/contracts')) {
    const contracts = fs.readdirSync('artifacts/contracts');
    if (contracts.length > 0) {
        passed++;
        console.log(`  ✅ ${contracts.length} contracts compiled`);
    } else {
        warnings.push('No compiled contracts found - run npm run compile');
    }
} else {
    warnings.push('Artifacts directory not found - run npm run compile');
}

// Test 8: Check .env.example exists
console.log('\n✓ Checking .env.example...');
if (fs.existsSync('.env.example')) {
    passed++;
    console.log('  ✅ .env.example exists');
} else {
    warnings.push('.env.example not found');
}

// Test 9: Check documentation
console.log('\n✓ Checking documentation...');
const docs = ['README.md', 'VERCEL_DEPLOYMENT.md', 'API_GUIDE.md'];
let docsOk = true;
docs.forEach(doc => {
    if (!fs.existsSync(doc)) {
        warnings.push(`Missing documentation: ${doc}`);
        docsOk = false;
    }
});

if (docsOk) {
    passed++;
    console.log('  ✅ All documentation present');
}

// Test 10: Check API routes
console.log('\n✓ Checking API routes...');
try {
    const apiContent = fs.readFileSync('api/server.js', 'utf8');
    const routes = ['/api/health', '/api/docs', '/api/auth/register', '/api/strategies'];
    let routesOk = true;
    
    routes.forEach(route => {
        if (!apiContent.includes(route)) {
            warnings.push(`API route may be missing: ${route}`);
            routesOk = false;
        }
    });
    
    if (routesOk) {
        passed++;
        console.log('  ✅ All API routes present');
    }
} catch (e) {
    errors.push('Could not verify API routes');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(50));
console.log(`✅ Passed: ${passed}/10`);
console.log(`⚠️  Warnings: ${warnings.length}`);
console.log(`❌ Errors: ${errors.length}`);

if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.forEach(w => console.log(`   - ${w}`));
}

if (errors.length > 0) {
    console.log('\n❌ ERRORS:');
    errors.forEach(e => console.log(`   - ${e}`));
    console.log('\n🚫 Deployment NOT ready. Fix errors above.');
    process.exit(1);
} else {
    console.log('\n✅ DEPLOYMENT READY!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Push to GitHub: git push origin main');
    console.log('   2. Deploy to Vercel: vercel --prod');
    console.log('   3. Deploy contracts: npm run deploy:coston2');
    console.log('   4. Update contract addresses in frontend/config.js');
    console.log('   5. Test deployed URL');
    console.log('\n🚀 Good luck with your hackathon!');
}
