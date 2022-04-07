import React, { Component } from 'react'
import Web3 from 'web3'
import Forecast from '../abis/Forecast.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()

    // Load Forecast
    const forecastData = Forecast.networks[networkId]
    if(forecastData) {
      const forecast = new web3.eth.Contract(Forecast.abi, forecastData.address)
      this.setState({ forecast })
      let forecastBalance = await forecast.methods.getEthBalance(this.state.account).call()
      this.setState({ forecastBalance: forecastBalance.toString() })

      let bidBalance = await forecast.methods.getBidByAddress(this.state.account).call()
      this.setState({ bidBalance: bidBalance.toString() })

      let rewardBalance = await forecast.methods.getRewardByAddress(this.state.account).call()
      this.setState({ rewardBalance: rewardBalance.toString() })

      let isOwner = await forecast.methods.isOwner(this.state.account).call()
      this.setState({ isOwner: isOwner.toString() })

      let isParticipant = await forecast.methods.isPart(this.state.account).call()
      this.setState({ isParticipant: isParticipant.toString() })

      let numberOfParticipants = await forecast.methods.getNumberOfParticipants().call()
      this.setState({ numberOfParticipants: numberOfParticipants.toString() })

      let totalFund = await forecast.methods.getBalance().call()
      this.setState({ totalFund: totalFund.toString() })

      let stateDapp = await forecast.methods.getState().call()
      this.setState({ stateDapp: stateDapp.toString() })


      let latestPrice = await forecast.methods.getLatestPrice().call()
      this.setState({ latestPrice: latestPrice.toString() })

      if (isParticipant) {
        let forecastValue = await forecast.methods.getForecastByAddress(this.state.account).call()
        this.setState({ forecastValue: forecastValue.toString() })
      }
    } else {
      window.alert('Forecast contract not deployed to detected network.')
    }

    this.setState({ loading: false })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  makeBid = (amount, forecastValue) => {
    this.setState({ loading: true })
    //this.state.forecast.methods.approve(this.state.forecast._address, window.web3.utils.toWei('0.01')).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.forecast.methods.enter(forecastValue * (10**6)).send({ from: this.state.account, value: window.web3.utils.toWei(amount) }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    //})

  }

  nextState = (amount) => {
    this.setState({ loading: true })
    this.state.forecast.methods.nextState().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  claimReward = () => {
    this.setState({ loading: true })
    this.state.forecast.methods.claimReward().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      forecast: {},
      dappToken: {},
      tokenFarm: {},
      forecastBalance: '0',
      rewardBalance: '0',
      bidBalance: '0',
      loading: true,
      isOwner: 'false',
      numberOfParticipants: 0,
      totalFund: 0,
      stateDapp: 0,
      forecastValue: 0,
      isParticipant: 'false',
      latestPrice: 0
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        forecastBalance={this.state.forecastBalance}
        rewardBalance={this.state.rewardBalance}
        bidBalance={this.state.bidBalance}
        makeBid={this.makeBid}
        nextState={this.nextState}
        claimReward={this.claimReward}
        isOwner={this.state.isOwner}
        numberOfParticipants={this.state.numberOfParticipants}
        totalFund={this.state.totalFund}
        stateDapp={this.state.stateDapp}
        forecastValue={this.state.forecastValue}
        isParticipant={this.state.isParticipant}
        latestPrice={this.state.latestPrice}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">



                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
