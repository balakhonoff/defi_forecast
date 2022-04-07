# defi_forecast
The dApp allows users to forecast a bitcoin price and bet by eth. The reward for users which has a error &lt; 1% will be proportional to their bids. 

[![DEMO VIDEO](https://i.ibb.co/MR5J4Qc/2022-04-07-23-59-30.png)](https://youtu.be/ooxiQ1nnVhs)

Click [this link](https://youtu.be/ooxiQ1nnVhs) to watch the demo video on YouTube

**Development of template for a dApp**

Install dependencies
```
npm install
```

Compile
```
truffle compile
```

Deploy contract
```
truffle migrate --reset
```

Deploy contract to specific net
```
truffle migrate --reset --network {mainnet,rinkeby,mumbai} 
```

Launch truffle console
```
truffle console
```

Run a script example
```
truffle exec scripts/issue-tokens.js
```

Run tests
```
truffle test 
```

Install web dependencies
```
npm install
npm i dotenv
npm install @truffle/hdwallet-provider
```

Run web application
```
npm run start
```

*Setting .env parameters*

Create .env file in the project folder and fill the addresses you will use:
```
PRIVATE_KEY_0="..."
PRIVATE_KEY_1="..."
SECRET_KEY="..."
RINKEBY_SERVER="..."
ETHER_MAINNET_SERVER="..."
MUMBAI_SERVER="..."
```


---
**Project folders**

`migrations` - deployment scripts

`scripts` - scripts to launch smart contract functionality

`contracts` - smart contract sources

`src/abi` - ABIs of smart contracts

`src/components` - js/css sources of the frontend solution

`test` - js tests of smart contract logic

---
**Usage**

1. Open a page created by the command `npm run start` - localhost:3000
2. Switch to the wallet account[0] and click "Next Step" and confirm transaction in MetaMask to change the status to "The forecast cycle is started".
3. Refresh the webpage and switch to account[1].
4. Insert a value in the field "Bid Value (ETH)" to set a bid. 
5. Insert a value in the field "Forecast BTC Price" to set a prediction.
6. Click "Bid!" button and approve the transaction.
7. Repeat the procedure of bidding with several accounts.
8. Then switch to the first account and click "Next Step"
9. Approve the transaction to stop the forecast cycle.
10. Click "Next Step" one more time to start the reward process
11. Then you can switch between accounts to see the "Claim Reward!" button for some of them which had an accurate prediction (<1% error)
12. After claiming rewards the owner can reset the forecast cycle with the button "Next Step"
