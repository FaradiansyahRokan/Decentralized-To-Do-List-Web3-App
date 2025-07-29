const { ethers } = require("hardhat");

async function main() {
  const TodoList = await ethers.getContractFactory("TodoList");
  const todo = await TodoList.deploy();

  console.log("Waiting for deployment...");
  await todo.waitForDeployment();

  const address = await todo.getAddress();
  console.log(`✅ TodoList deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
