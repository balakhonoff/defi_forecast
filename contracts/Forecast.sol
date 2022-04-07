// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

/* import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import './interfaces/IERC20.sol'; */
// https://docs.chain.link/docs/bnb-chain-addresses/
// 0xECe365B379E1dD183B20fc5f022230C044d51404 - rinkeby btc/usd
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";



contract Forecast {
  bool TEST = true;

  AggregatorV3Interface internal priceFeed;

  address public owner;

  address payable[] public participants;
  mapping(address => bool) public isParticipant;
  mapping(address => uint) public forecastOfParticipant;
  mapping(address => uint) public bidOfParticipant;

  address payable[] public winners;
  mapping(address => bool) public isWinner;
  mapping(address => uint) public rewardOfWinner;

  uint8 public state; // 0 - not started, 1 - receiving forecasts, 2 - waiting for a result date, 3 (never) is the same as 0

  uint public forecastId;
  mapping (uint => address payable) public forecastHistory;

  event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

  constructor() {
    owner = msg.sender;
    /* owner = 0x05FB73503E213C602A8b76650Fc7f6C6758Cb6e8; */
    state = 0;
    priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e); //rinkeby
    /* priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331); //kovan */
    /* priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331); //mumbai */
  }

  function getLatestPrice() public view returns (int) {
    //STARTING COMMENT (1 of 3)
    if (TEST) {
      int price = 42500123456;
      return price;
    } else {
      //ENDING COMMENT (2 of 3)
    (
        /*uint80 roundID*/,
        int price,
        /*uint startedAt*/,
        /*uint timeStamp*/,
        /*uint80 answeredInRound*/
    ) = priceFeed.latestRoundData();
    return price;
    } //AND THIS TO COMMENTED (3 of 3)

  }
  function nextState() public onlyowner {
    if (state == 0) {
      state = 1;
    } else {
      if (state == 1) {
        state = 2;
      } else {
        if (state == 2) {
          rewardWinners();
        } else {
          resetForecast();
        }
      }
    }
  }
  function getForecastByAddress(address participant) public view returns (uint) {
    require(isParticipant[participant] == true, "The address is not a participant");
    return forecastOfParticipant[participant];
  }

  function startReveivingForecasts() public onlyowner {
    require(state == 0, "You can start receiving forecasts only in state 0");
    state = 1;
  }

  function stopReveivingForecasts() public onlyowner {
    require(state == 1, "You can stop receiving forecasts only in state 1");
    state = 2;
  }

  function rewardWinners() public onlyowner {
    require(state == 2, "You can reward the winners only in state 2");
    uint resultValue = uint(getLatestPrice());
    address _address;
    uint _forecast;
    int _err;
    uint _fundToReward = 0;
    uint _sumOfWinnerBids = 0;

    for (uint i=0; i<participants.length; i++) {
      _address = participants[i];
      _forecast = forecastOfParticipant[_address];
      _err = int(_forecast) - int(resultValue);
      if (_err < 0) {
        _err = -_err;
      }
      if (uint(_err) * 100 < resultValue) {

        isWinner[_address] = true;
        winners.push(payable(_address));

        _sumOfWinnerBids = _sumOfWinnerBids + bidOfParticipant[_address];
      }
      else {
        //isWinner[_address] = false;
        _fundToReward = _fundToReward + bidOfParticipant[_address];
        //rewardOfWinner[_address]= 0;
      }

    }
    /* _fundToReward = _fundToReward * (10 ** 6); // can be reduced */
    /* _sumOfWinnerBids = _sumOfWinnerBids * (10 ** 6); */
    for (uint i=0; i<winners.length; i++) {
      _address = winners[i];
      rewardOfWinner[_address] = bidOfParticipant[_address] + (bidOfParticipant[_address]  * _fundToReward / _sumOfWinnerBids);
    }


    state = 3;
  }
  function getState() public view returns (uint) {
      return state;
  }

  function getBalance() public view returns (uint) {
      return address(this).balance;
  }

  function getParticipants() public view returns (address payable[] memory) {
      return participants;
  }
  function getNumberOfParticipants() public view returns (uint) {
      return participants.length;
  }
  function getWinners() public view returns (address payable[] memory) {
      return winners;
  }
  function isOwner(address _addr) public view returns (bool) {
    if (_addr == owner) {
      return true;
    } else {
      return false;
    }
  }
  function isPart(address _addr) public view returns (bool) {
    if (isParticipant[_addr]) {
      return true;
    } else {
      return false;
    }
  }
  function getRewardByAddress(address participant) public view returns (uint) {
      if (isWinner[participant]) {
        return rewardOfWinner[participant];
      } else {
        return 0;
      }
  }
  function getBidByAddress(address participant) public view returns (uint) {
      if (isParticipant[participant]) {
        return bidOfParticipant[participant];
      } else {
        return 0;
      }
  }

  function enter(uint _forecastValue) public payable returns (bool) {
    require(state == 1, "We are currently not accepting forecasts");
    require(msg.value > .001 ether, "You do not have enough funds to participate");
    // address of player entering forecast
    require(!isParticipant[payable(msg.sender)], "You are already a participant");
    /* require(msg.value > msg.value, "You do not have enough funds to make this value prediction"); */

    /* require(payable(address(this)).send(msg.value), "The transfer failed, you are not a participant yet"); */
    /* payable(address(this)).transfer(msg.value); */
    forecastOfParticipant[msg.sender] = _forecastValue;
    bidOfParticipant[msg.sender] = msg.value;
    isParticipant[msg.sender] = true;
    participants.push(payable(msg.sender));

    emit Transfer(msg.sender, address(this), msg.value);
    return true;
  }
  function remove(uint index) public{
    winners[index] = winners[winners.length - 1];
    winners.pop();
  }
  function getEthBalance(address _addr) public view returns(uint) {
      return _addr.balance;
  }
  function claimReward() public {
    require(isWinner[msg.sender] == true, "You are not a winner");
    require(state == 3, "You can claim the reward only after the end of forecast");
    address payable _to = payable(msg.sender);
    _to.transfer(rewardOfWinner[msg.sender]);
    /* rewardOfWinner[msg.sender] = 0; */
    delete(isWinner[msg.sender]);
    delete(rewardOfWinner[msg.sender]);
    for (uint i=0; i<winners.length; i++) {
      if (winners[i] == _to) {
        remove(i);
        break;
      }
    }
  }
  /* function withdrawNotClaimed() public onlyowner {

  } */

  function resetForecast() public onlyowner {
    require(state == 3, "You can start receiving forecasts only in state 3");
    address _address;
    winners = new address payable[](0);

    for (uint i=0; i<participants.length; i++) {
      _address = participants[i];
      isParticipant[_address] = false;
    }
    participants = new address payable[](0);

    state = 0;
  }
  modifier onlyowner() {
    require(msg.sender == owner);
    _;
  }
}
