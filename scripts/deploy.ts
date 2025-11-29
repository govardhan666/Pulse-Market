import hre from "hardhat";

async function main() {
  console.log("Deploying PulseMarket to Somnia testnet...");

  const pulseMarket = await hre.viem.deployContract("PulseMarket");

  console.log(`✅ PulseMarket deployed to: ${pulseMarket.address}`);
  console.log(`🔗 View on explorer: https://shannon-explorer.somnia.network/address/${pulseMarket.address}`);

  // Save deployment address
  const fs = require('fs');
  const deploymentInfo = {
    address: pulseMarket.address,
    network: "somnia-testnet",
    chainId: 50312,
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    './lib/contract-address.json',
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("📝 Deployment info saved to lib/contract-address.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
