import hre from "hardhat";

async function main() {
  console.log("🚀 Deploying Flare Autopilot contracts...\n");

  // Deploy AutomationHub
  console.log("Deploying AutomationHub...");
  const AutomationHub = await hre.ethers.getContractFactory("AutomationHub");
  const automationHub = await AutomationHub.deploy();
  await automationHub.waitForDeployment();
  console.log("✅ AutomationHub deployed to:", await automationHub.getAddress());

  // Deploy FTSOPriceTrigger
  console.log("\nDeploying FTSOPriceTrigger...");
  const FTSOPriceTrigger = await hre.ethers.getContractFactory("FTSOPriceTrigger");
  const ftsoPriceTrigger = await FTSOPriceTrigger.deploy();
  await ftsoPriceTrigger.waitForDeployment();
  console.log("✅ FTSOPriceTrigger deployed to:", await ftsoPriceTrigger.getAddress());

  // Deploy FDCEventTrigger
  console.log("\nDeploying FDCEventTrigger...");
  const FDCEventTrigger = await hre.ethers.getContractFactory("FDCEventTrigger");
  const fdcEventTrigger = await FDCEventTrigger.deploy();
  await fdcEventTrigger.waitForDeployment();
  console.log("✅ FDCEventTrigger deployed to:", await fdcEventTrigger.getAddress());

  // Deploy SmartAccountExecutor
  console.log("\nDeploying SmartAccountExecutor...");
  const SmartAccountExecutor = await hre.ethers.getContractFactory("SmartAccountExecutor");
  const smartAccountExecutor = await SmartAccountExecutor.deploy();
  await smartAccountExecutor.waitForDeployment();
  console.log("✅ SmartAccountExecutor deployed to:", await smartAccountExecutor.getAddress());

  // Deploy FAssetsIntegration
  console.log("\nDeploying FAssetsIntegration...");
  const FAssetsIntegration = await hre.ethers.getContractFactory("FAssetsIntegration");
  const fAssetsIntegration = await FAssetsIntegration.deploy();
  await fAssetsIntegration.waitForDeployment();
  console.log("✅ FAssetsIntegration deployed to:", await fAssetsIntegration.getAddress());

  console.log("\n🎉 All contracts deployed successfully!\n");
  console.log("📝 Contract Addresses:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("AutomationHub:        ", await automationHub.getAddress());
  console.log("FTSOPriceTrigger:     ", await ftsoPriceTrigger.getAddress());
  console.log("FDCEventTrigger:      ", await fdcEventTrigger.getAddress());
  console.log("SmartAccountExecutor: ", await smartAccountExecutor.getAddress());
  console.log("FAssetsIntegration:   ", await fAssetsIntegration.getAddress());
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    contracts: {
      AutomationHub: await automationHub.getAddress(),
      FTSOPriceTrigger: await ftsoPriceTrigger.getAddress(),
      FDCEventTrigger: await fdcEventTrigger.getAddress(),
      SmartAccountExecutor: await smartAccountExecutor.getAddress(),
      FAssetsIntegration: await fAssetsIntegration.getAddress()
    }
  };

  console.log("💾 Save these addresses for frontend integration!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
