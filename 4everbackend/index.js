const express = require('express');
const app = express();
var cors = require('cors')
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const { joinMarketplace } = require('./src/services/market');
app.use(express.json());
app.use(cors());

//Connect to Ganache
const { Web3 } = require('web3');

// Replace with the Ganache RPC endpoint
const ganacheRpcEndpoint = 'http://127.0.0.1:7545';

// Create a Web3 instance connected to Ganache
const web3 = new Web3(ganacheRpcEndpoint);

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
 
// Routes 
const assetRouter = require('./src/controllers/AssetController');
const governanceRouter = require('./src/controllers/GovernanceController');

// Existing routes
app.use('/api/assets', assetRouter);
app.use('/api/governance', governanceRouter);

// Join Market
app.post('/api/join-marketplace', (req, res) => {
  // Pass the web3 instance to the joinMarketplace function
  joinMarketplace(web3, req, res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
