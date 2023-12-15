require('dotenv').config();

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const ganacheRpcEndpoint = process.env.GANACHE;
const FourEverAddress = process.env.MARKETADDR;
const FourEverABI = require('./Truffle/build/contracts/FourEver.json').abi;

const { joinMarketplace } = require('./src/services/market');
const { Web3 } = require('web3');

//Connect to Ganache
const web3 = new Web3(ganacheRpcEndpoint);

//Contract instance
const marketplaceContract = new web3.eth.Contract(FourEverABI, FourEverAddress);

const app = express();
app.use(express.json());
app.use(cors());

// Middleware to pass web3 to all routes
app.use((req, res, next) => {
    req.web3 = web3;
    next();
});

// Test the connection
web3.eth.getBlockNumber()
    .then(blockNumber => {
        console.log('Connected to Ganache. Current block number:', blockNumber);
    })
    .catch(error => {
        console.error('Error connecting to Ganache:', error);
    });

// Join Market
app.post('/api/join-marketplace', (req, res) => {
    joinMarketplace(web3, req, res, marketplaceContract);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
