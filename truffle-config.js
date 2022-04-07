//npm i dotenv
//gitignore .env
//create .env file
//npm install @truffle/hdwallet-provider
require('dotenv').config()
const HDWalletProvider = require("@truffle/hdwallet-provider")

require('babel-register');
require('babel-polyfill');

const private_keys = [
  process.env.PRIVATE_KEY_0,
  process.env.PRIVATE_KEY_1
]
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    bnbtest: {
      provider: () => new HDWalletProvider(
        process.env.SECRET_KEY,
        process.env.BNBTEST_SERVER,
      ),
      network_id: 97,
      gas: 5500000,
      // networkCheckTimeoutnetworkCheckTimeout: 10000,
      // confirmations: 2,
      // timeoutBlocks: 200,
      skipDryRun: true
    },
    rinkeby: {
      provider: () => new HDWalletProvider(
        process.env.SECRET_KEY,
        process.env.RINKEBY_SERVER,
      ),
      network_id: 4,
      gas: 5500000,
      networkCheckTimeoutnetworkCheckTimeout: 10000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    rinkeby2: {
      provider: () => new HDWalletProvider(
        process.env.SECRET_KEY,
        process.env.RINKEBY2_SERVER,
      ),
      network_id: 4,
      gas: 5500000,
      networkCheckTimeoutnetworkCheckTimeout: 10000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    rinkeby3: {
      provider: () => new HDWalletProvider(
        process.env.SECRET_KEY,
        process.env.RINKEBY3_SERVER,
      ),
      network_id: 4,
      gas: 5500000,
      networkCheckTimeoutnetworkCheckTimeout: 10000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    kovan: {
      provider: () => new HDWalletProvider(
        process.env.SECRET_KEY,
        process.env.KOVAN_SERVER,
      ),
      network_id: 42,
      gas: 5500000,
      networkCheckTimeoutnetworkCheckTimeout: 10000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    mainnet: {
      provider: () => new HDWalletProvider(
        process.env.SECRET_KEY,
        process.env.ETHER_MAINNET_SERVER,
      ),
      network_id: 1,
      gas: 2000000,
      gasPrice:100000000000000,
      confirmations: 2,
      skipDryRun: true
    },
    mumbai: {
      provider: () => new HDWalletProvider(
        process.env.SECRET_KEY,
        process.env.MUMBAI_SERVER,
      ),
      network_id: 80001,
      gas: 5500000,
      // networkCheckTimeoutnetworkCheckTimeout: 10000,
      // confirmations: 2,
      // timeoutBlocks: 200,
      skipDryRun: true
    },
    mumbai2: {
      provider: () => new HDWalletProvider(
        process.env.SECRET_KEY,
        process.env.MUMBAI2_SERVER,
      ),
      network_id: 80001,
      gas: 5500000,
      networkCheckTimeoutnetworkCheckTimeout: 10000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  contracts_directory: './contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      version: "^0.8.11",
      evmVersion: "petersburg"
    }
  }
}
