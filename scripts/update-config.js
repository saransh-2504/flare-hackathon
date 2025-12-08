/**
 * Update frontend config with deployed contract addresses
 * Run after deployment: node scripts/update-config.js
 */

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n🔧 Frontend Configuration Updater\n');
console.log('This will update public/config.js with your deployed contract addresses.\n');

const addresses = {};

function askAddress(contractName) {
    return new Promise((resolve) => {
        rl.question(`Enter ${contractName} address: `, (answer) => {
            addresses[contractName] = answer.trim();
            resolve();
        });
    });
}

async function main() {
    // Ask for all contract addresses
    await askAddress('AUTOMATION_HUB');
    await askAddress('FTSO_PRICE_TRIGGER');
    await askAddress('FDC_EVENT_TRIGGER');
    await askAddress('SMART_ACCOUNT_EXECUTOR');
    await askAddress('FASSETS_INTEGRATION');
    await askAddress('SECURITY_FIREWALL');
    
    rl.close();
    
    // Read current config
    const configPath = 'public/config.js';
    let config = fs.readFileSync(configPath, 'utf8');
    
    // Update contract addresses
    config = config.replace(
        /AUTOMATION_HUB: '0x\.\.\.'/,
        `AUTOMATION_HUB: '${addresses.AUTOMATION_HUB}'`
    );
    config = config.replace(
        /FTSO_PRICE_TRIGGER: '0x\.\.\.'/,
        `FTSO_PRICE_TRIGGER: '${addresses.FTSO_PRICE_TRIGGER}'`
    );
    config = config.replace(
        /FDC_EVENT_TRIGGER: '0x\.\.\.'/,
        `FDC_EVENT_TRIGGER: '${addresses.FDC_EVENT_TRIGGER}'`
    );
    config = config.replace(
        /SMART_ACCOUNT_EXECUTOR: '0x\.\.\.'/,
        `SMART_ACCOUNT_EXECUTOR: '${addresses.SMART_ACCOUNT_EXECUTOR}'`
    );
    config = config.replace(
        /FASSETS_INTEGRATION: '0x\.\.\.'/,
        `FASSETS_INTEGRATION: '${addresses.FASSETS_INTEGRATION}'`
    );
    config = config.replace(
        /SECURITY_FIREWALL: '0x\.\.\.'/,
        `SECURITY_FIREWALL: '${addresses.SECURITY_FIREWALL}'`
    );
    
    // Write updated config
    fs.writeFileSync(configPath, config);
    
    console.log('\n✅ Configuration updated successfully!');
    console.log('\n📝 Updated addresses:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    Object.entries(addresses).forEach(([name, address]) => {
        console.log(`${name.padEnd(25)}: ${address}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('🎉 Frontend is now configured!');
    console.log('\nNext steps:');
    console.log('1. Create bot wallet: create-bot-wallet.bat');
    console.log('2. Fund bot wallet with C2FLR');
    console.log('3. Update bot/.env with addresses');
    console.log('4. Start frontend: npx http-server public -p 8080');
    console.log('5. Start bot: cd bot && node auto-monitor.js\n');
}

main().catch(console.error);
