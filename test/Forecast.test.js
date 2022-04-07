const Forecast = artifacts.require("Forecast")

require("chai")
  .use(require("chai-as-promised"))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("Forecast", (accounts) => {
  let forecast

  before(async () => {
    // Load Contracts
    // forecast = await Forecast.new()
    forecast = await Forecast.deployed()

  })

  describe("Deployment", async () => {
    it("has an owner", async () => {
      const owner = await forecast.owner()
      assert.equal(accounts[0], owner, "The owner is incorrect")
    })
  })
  describe("Test state changes", async () => {
    it("going through states", async () => {
      //console.log("HELLO")
      const owner = await forecast.owner()

      //console.log("HELLO")
      state = await forecast.state()

      assert.equal(state.toString(), "0", "The state is not 0 at startup")

      await forecast.startReveivingForecasts({from: owner})
      state = await forecast.state()
      assert.equal(state.toString(), "1", "The state is not 1 after startReveivingForecasts")

      await forecast.stopReveivingForecasts({from: owner})
      state = await forecast.state()
      assert.equal(state.toString(), "2", "The state is not 2 after stopReveivingForecasts")

      await forecast.rewardWinners({from: owner})
      state = await forecast.state()
      assert.equal(state.toString(), "3", "The state() is not 3 after rewardWinners")

      await forecast.resetForecast({from: owner})
      state = await forecast.state()
      assert.equal(state.toString(), "0", "The state() is not 0 after resetForecast")

    })
  })
  describe("trying to enter", async () => {
    it("entering...", async () => {
      //console.log("HELLO")
      const owner = await forecast.owner()

      await forecast.enter(42000123456, {from: accounts[1], value: tokens('0.01')}).should.be.rejected

      await forecast.startReveivingForecasts({from: owner})

      // await this.hello_erc20.approve(forecast, tokens('1'), { from: owner });
      await forecast.enter(42000123456, {from: accounts[1], value: tokens('0.01')})

      let forecastOfParticipant = await forecast.getForecastByAddress(accounts[1])
      //console.log(forecastOfParticipant.toString())
      assert.equal(forecastOfParticipant.toString(), "42000123456", "The forecast is correct")

      let balance = await forecast.getBalance()
      //console.log(balance.toString())
      assert.equal(balance.toString(), tokens('0.01'));
    })
    it("second participant", async () => {

      // await this.hello_erc20.approve(forecast, tokens('1'), { from: owner });
      await forecast.enter(45000123456, {from: accounts[2], value: tokens('0.01')})

      balance = await forecast.getBalance()
      //console.log(balance.toString())
      assert.equal(balance.toString(), tokens('0.02'));

      forecastOfParticipant = await forecast.getForecastByAddress(accounts[2])
      //console.log(forecastOfParticipant.toString())
      assert.equal(forecastOfParticipant.toString(), "45000123456", "The forecast is correct")

      await forecast.enter(45, {from: accounts[2], value: tokens('0.01')}).should.be.rejected

      forecastOfParticipant = await forecast.getForecastByAddress(accounts[1])
      //console.log(forecastOfParticipant.toString())
      assert.equal(forecastOfParticipant.toString(), "42000123456", "The forecast is correct")

      await forecast.getForecastByAddress(accounts[3]).should.be.rejected
    })
    // it("check chainlink", async () => {
    //   let result = await forecast.getLatestPrice()
    //   console.log(result.toString())
    // })

  })
  describe("check the real value", async () => {
    it("check get latest price...", async () => {
      result = await forecast.getLatestPrice()
      assert.equal(result.toString(), "42500123456", "The forecast is correct")
    })
  })
  describe("end of the forecast", async () => {
    it("check get latest price...", async () => {
      const owner = await forecast.owner()
      result = await forecast.getEthBalance(accounts[0])
      console.log('Balance of owner is:',web3.utils.fromWei(result.toString()))

      await forecast.enter(42500000000, {from: accounts[3], value: tokens('0.01')})
      await forecast.enter(43500000000, {from: accounts[4], value: tokens('0.02')})
      await forecast.enter(42202622591, {from: accounts[5], value: tokens('0.03')})
      await forecast.enter(43500000000, {from: accounts[6], value: tokens('0.03')})
      await forecast.stopReveivingForecasts({from: owner})

      result = await forecast.getParticipants()
      console.log(result.toString())

      await forecast.rewardWinners()
      console.log('----')
      result = await forecast.getWinners()
      console.log(result.toString())

      var step;
      var bid;

      for (step = 1; step < 7; step++) {
        // Запускается 5 раз, с шагом от 0 до 4.

        // result = await forecast.getRewardByAddress(accounts[step]);
        result = await forecast.getBidByAddress(accounts[step]);
        console.log(step, accounts[step], web3.utils.fromWei(result.toString()));
      }
      console.log('----')
      for (step = 1; step < 7; step++) {
        // Запускается 5 раз, с шагом от 0 до 4.

        // result = await forecast.getRewardByAddress(accounts[step]);
        result = await forecast.getRewardByAddress(accounts[step]);
        console.log(step, accounts[step], web3.utils.fromWei(result.toString()));
      }
      await forecast.claimReward({from: accounts[2]}).should.be.rejected

      result = await forecast.getEthBalance(accounts[3])
      console.log('Balance of winner before:',web3.utils.fromWei(result.toString()))

      await forecast.claimReward({from: accounts[3]})
      console.log('----')
      result = await forecast.getWinners()
      console.log(result.toString())

      result = await forecast.getBalance()
      console.log('balance now:', result.toString())

      console.log('----')
      for (step = 1; step < 7; step++) {


        // result = await forecast.getRewardByAddress(accounts[step]);
        result = await forecast.getRewardByAddress(accounts[step]);
        console.log(step, accounts[step], web3.utils.fromWei(result.toString()));
      }

      result = await forecast.getEthBalance(accounts[3])
      console.log('Balance of winner after:',web3.utils.fromWei(result.toString()))
      // assert.equal(result.toString(), "42500123", "The forecast is correct")
      console.log((await forecast.isPart(accounts[3])).toString())
      await forecast.resetForecast()
    })
  })
})
