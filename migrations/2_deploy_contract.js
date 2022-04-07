const Forecast = artifacts.require('Forecast')

module.exports = async function(deployer, network, accounts) {
  // Deploy
  await deployer.deploy(Forecast)
  const forecast = await Forecast.deployed()

}
