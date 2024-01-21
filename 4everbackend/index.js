//Load environment variables from a .env file into process.env
require('dotenv').config();

//Require modules
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
var fs = require('fs');
const http = require('http');
const { Web3 } = require('web3');
const { Socket } = require('./src/services/Socket');
const { Market } = require('./src/services/Market');
const { Quests } = require('./src/services/Quests');
const { AsyncNedb } = require('nedb-async')
const FourEverABI = require('./Truffle/build/contracts/FourEver.json').abi;
var dir = path.join(__dirname, '');

//Create database
var questsDatabase = new AsyncNedb({ filename: path.join(__dirname, '/database/quests.db'), autoload: true });
var companiesDatabase = new AsyncNedb({ filename: path.join(__dirname, '/database/companies.db'), autoload: true });

//Create express app
const app = express();
app.use(express.json());
app.use(cors());

//CesareDev: create web socket for realt time update
const server = http.createServer(app);
const socket = new Socket(server);

//Connect to Ganache
const web3 = new Web3(process.env.GANACHE);

// Test the connection
web3.eth.getBlockNumber()
    .then(blockNumber => {
        console.log('[Ganache]: Connected to Ganache, block number: ' + blockNumber);
    })
    .catch(error => {
        console.log(error);
    });

//CesareDev: Middleware to pass web3 to all routes
app.use((req, res, next) => {
    req.web3 = web3;
    next();
});

//Contract instance
const fourEverContract = new web3.eth.Contract(FourEverABI, process.env.MARKETADDR);

//Market interface
const market = new Market(web3, fourEverContract, socket);

// Quests interface
const quests = new Quests(web3, fourEverContract, socket, questsDatabase, companiesDatabase);

//------------------------------------------
// Market API
//------------------------------------------

// Join Market endpoint
app.post('/api/join-marketplace', (req, res) => {
    market.joinMarketplace(req, res);
});

app.get('/api/get-merchants', (req, res) => {
    market.getMerchants(req, res);
});

//------------------------------------------
// Quest API
//------------------------------------------

//CesareDev: Virtually join the quest
//           REQUEST must contain
//           - userAddress
//           - questName
app.post('/api/join-quest', (req, res) => {
    quests.joinQuest(req, res);
});

//Andrea: Added endpoint to unjoin a quest, if the quest has not started yet (for testing or should we keep?)
app.post('/api/unjoin-quest', (req, res) => {
    quests.unjoinQuest(req, res);
});

//CesareDev: Check the user's quest participations
//           REQUEST must contain
//           - userAddress
app.post('/api/is-user-registered', (req, res) => {
    quests.isUserRegistered(req, res);
})

//CesareDev: Get all the activeQuest.
app.get('/api/get-quests', (req, res) => {
    quests.getActiveQuest(req, res);
});

// Andrea: DEBUG -> Simulate the victory by forcefully set a winner
app.post('/api/simulate-victory', (req, res) => {
    quests.registerVictory(req, res);
});

//------------------------------------------
// NFTs API
//------------------------------------------

// Andrea: Get the NFTs of a user
app.get('/api/get-nfts', (req, res) => {
    // Andrea: Pass to the NFTsHandler the request and response
    market.getNFTs(req, res);
});

//CesareDev: Buy a NFT
app.post('/api/buy-nft', (req, res) => {
    market.buyNFT(req, res);
});

app.post('/api/sell-nft', (req, res) => {
    market.buyNFT(req, res);
});

app.post('/api/unsell-nft', (req, res) => {
    market.unsellNFT(req, res);
});

//Andrea: Get the images from the NFTs folder
var mime = { png: 'image/png' };

app.get('*', (req, res) => {
    var file = path.join(dir, req.path.replace(/\/$/, '/index.html'));
    if (file.indexOf(dir + path.sep) !== 0) {
        return res.status(403).end('Forbidden');
    }
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
});

//Andrea: Use Cron to manage quests
cron.schedule('0 0 * * *', () => {
    //Andrea: This function will be executed every day at midnight
    quests.handleQuestsLifeCycle();
});

// Start the server
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
