const Main = artifacts.require("Main");
const CentralGov = artifacts.require('CentralGov');
const StateGov = artifacts.require('StateGov');
const Product = artifacts.require('Product');
const Stakeholder = artifacts.require('Stakeholder');

module.exports = async function (deployer) {
  await deployer.deploy(CentralGov);
  const centralGov = await CentralGov.deployed();

  await deployer.deploy(StateGov);
  const stateGov = await StateGov.deployed();

  await deployer.deploy(Stakeholder);
  const stakeholder = await Stakeholder.deployed();

  await deployer.deploy(Product);
  const product = await Product.deployed();

  await deployer.deploy(Main, centralGov.address, stateGov.address, stakeholder.address);
};
