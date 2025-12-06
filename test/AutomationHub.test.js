import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("AutomationHub", function () {
  let automationHub;
  let owner, user1, executor;

  beforeEach(async function () {
    [owner, user1, executor] = await ethers.getSigners();

    const AutomationHub = await ethers.getContractFactory("AutomationHub");
    automationHub = await AutomationHub.deploy();
  });

  describe("Strategy Creation", function () {
    it("Should create a new strategy", async function () {
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["string", "uint256", "bool"],
        ["BTC", ethers.parseUnits("50000", 18), true]
      );

      const actionData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "address", "uint256"],
        [ethers.ZeroAddress, user1.address, ethers.parseEther("1")]
      );

      const tx = await automationHub.connect(user1).createStrategy(
        0, // PRICE_ABOVE
        1, // TRANSFER
        triggerData,
        actionData,
        0  // unlimited executions
      );

      await expect(tx)
        .to.emit(automationHub, "StrategyCreated")
        .withArgs(1, user1.address, 0);

      const strategy = await automationHub.strategies(1);
      expect(strategy.owner).to.equal(user1.address);
      expect(strategy.active).to.be.true;
    });

    it("Should return user strategies", async function () {
      const triggerData = "0x";
      const actionData = "0x";

      await automationHub.connect(user1).createStrategy(0, 1, triggerData, actionData, 0);
      await automationHub.connect(user1).createStrategy(0, 1, triggerData, actionData, 0);

      const userStrategies = await automationHub.getUserStrategies(user1.address);
      expect(userStrategies.length).to.equal(2);
    });
  });

  describe("Strategy Execution", function () {
    beforeEach(async function () {
      await automationHub.authorizeExecutor(executor.address);
    });

    it("Should allow authorized executor to execute strategy", async function () {
      const triggerData = "0x";
      const actionData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "address", "uint256"],
        [ethers.ZeroAddress, user1.address, ethers.parseEther("1")]
      );

      await automationHub.connect(user1).createStrategy(0, 1, triggerData, actionData, 0);

      const tx = await automationHub.connect(executor).executeStrategy(1);
      await expect(tx)
        .to.emit(automationHub, "StrategyExecuted")
        .withArgs(1, executor.address);

      const strategy = await automationHub.strategies(1);
      expect(strategy.executionCount).to.equal(1);
    });

    it("Should not allow unauthorized executor", async function () {
      const triggerData = "0x";
      const actionData = "0x";

      await automationHub.connect(user1).createStrategy(0, 1, triggerData, actionData, 0);

      await expect(
        automationHub.connect(user1).executeStrategy(1)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should respect max executions limit", async function () {
      const triggerData = "0x";
      const actionData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "address", "uint256"],
        [ethers.ZeroAddress, user1.address, ethers.parseEther("1")]
      );

      await automationHub.connect(user1).createStrategy(0, 1, triggerData, actionData, 1);

      await automationHub.connect(executor).executeStrategy(1);

      await expect(
        automationHub.connect(executor).executeStrategy(1)
      ).to.be.revertedWith("Max executions reached");
    });
  });

  describe("Strategy Management", function () {
    it("Should allow owner to deactivate strategy", async function () {
      const triggerData = "0x";
      const actionData = "0x";

      await automationHub.connect(user1).createStrategy(0, 1, triggerData, actionData, 0);

      await automationHub.connect(user1).deactivateStrategy(1);

      const strategy = await automationHub.strategies(1);
      expect(strategy.active).to.be.false;
    });

    it("Should not allow non-owner to deactivate", async function () {
      const triggerData = "0x";
      const actionData = "0x";

      await automationHub.connect(user1).createStrategy(0, 1, triggerData, actionData, 0);

      await expect(
        automationHub.connect(owner).deactivateStrategy(1)
      ).to.be.revertedWith("Not strategy owner");
    });
  });
});
