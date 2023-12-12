//Requirements
require('dotenv').config();
var cors = require('cors')
const PORT = process.env.PORT || 5000;
const ganacheRpcEndpoint = process.env.GANACHE;

const { joinMarketplace } = require('./src/services/market');
const { Web3 } = require('web3');

//App Setup
const express = require('express');
const app = express();
app.use(express.json());
app.use(cors());

//Connect to Ganache
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
