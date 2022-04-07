const Forecast = artifacts.require("Forecast")

module.exports = async callback => {
  const forecast = await Forecast.deployed()
  const latestPrice = await forecast.getLatestPrice()
  // console.log(latestPrice.toString())
  callback(latestPrice)
}
