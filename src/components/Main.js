import React, { Component } from 'react'
import eth from '../eth-logo.png'
var dictStates = {
  0: "The forecast is not started",
  1: "The forecast cycle is started",
  2: "Collection of forecasts completed",
  3: "The reward claiming process"
};
class Main extends Component {

  render() {
    return (
      <div id="content" className="mt-3">

        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Total Fund</th>
              <th scope="col">Number of Participants</th>
              <th scope="col">Current Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{window.web3.utils.fromWei(this.props.totalFund)} ETH</td>
              <td>{this.props.numberOfParticipants}</td>
              <td>{dictStates[this.props.stateDapp]}</td>
            </tr>
          </tbody>
        </table>
        {(this.props.stateDapp == 1) && (this.props.isParticipant != 'true') &&
        <div className="card mb-4" >

          <div className="card-body">

            <form className="mb-3" onSubmit={(event) => {
                event.preventDefault()
                let amount
                amount = this.input.value.toString()
                // amount = window.web3.utils.toWei(amount, 'Ether')

                let forecastValue
                forecastValue = this.input2.value.toString()
                //amount = window.web3.utils.toWei(amount, 'Ether')
                console.log(amount, forecastValue)
                this.props.makeBid(amount, forecastValue)
              }}>

              <div>
                <label className="float-left"><b>Make a bid</b></label>
                <span className="float-right text-muted">
                  Balance: {parseFloat(window.web3.utils.fromWei(this.props.forecastBalance, 'Ether')).toFixed(4)} ETH
                </span>
              </div>


              <div className="input-group mb-4">

                <input
                  type="text"
                  ref={(input) => { this.input = input }}
                  className="form-control form-control-lg"
                  placeholder="Bid Value (ETH)"
                  required />
                <input
                  type="text"
                  ref={(input) => { this.input2 = input }}
                  className="form-control form-control-lg"
                  placeholder="Forecast BTC Price"
                  required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={eth} height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; ETH
                  </div>
                </div>
              </div>


              <button type="submit" className="btn btn-primary btn-block btn-lg">Bid!</button>

            </form>
          </div>
        </div>
      }

        {this.props.isOwner == 'true' &&
        <button
          type="submit"
          className="btn btn-link btn-block btn-sm"
          onClick={(event) => {
            event.preventDefault()
            this.props.nextState()
          }}>
            Next Step
          </button>
          }
        {this.props.isParticipant == 'true' &&
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Bid Balance</th>
              <th scope="col">Forecast Value</th>
              <th scope="col">Reward Balance</th>

            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{parseFloat(window.web3.utils.fromWei(this.props.bidBalance, 'Ether'))} ETH</td>
              <td>{this.props.forecastValue / (10 ** 6)} $</td>
              <td>{parseFloat(window.web3.utils.fromWei(this.props.rewardBalance, 'Ether'))} ETH</td>

            </tr>
          </tbody>
        </table>
      }
      {this.props.rewardBalance > 0 &&
        <button onClick={this.props.claimReward} className="btn btn-primary btn-block btn-lg">Claim Reward!</button>
      }
      </div>
    );
  }
}

export default Main;
