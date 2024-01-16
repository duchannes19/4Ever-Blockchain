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
const { Generator } = require('./src/services/Generator');
const { AsyncNedb } = require('nedb-async')
const FourEverABI = require('./Truffle/build/contracts/FourEver.json').abi;
var dir = path.join(__dirname, '');

//CesareDev: Image generation remove for now
/*
const items = require('./items/unused.json');
const items_used = require('./items/used.json');
const generator = new Generator();
*/

//Connect to Ganache
const web3 = new Web3(process.env.GANACHE);

//Contract instance
const fourEverContract = new web3.eth.Contract(FourEverABI, process.env.MARKETADDR);

//Market interface
const market = new Market(web3, fourEverContract);

//Create database
var questsDatabase = new AsyncNedb({ filename: path.join(__dirname, '/database/quests.db'), autoload: true });
var companiesDatabase = new AsyncNedb({ filename: path.join(__dirname, '/database/companies.db'), autoload: true });
var nftsDatabase = new AsyncNedb({ filename: path.join(__dirname, '/database/nfts.db'), autoload: true });

// Test the connection
web3.eth.getBlockNumber()
    .then(blockNumber => {
        console.log('Connected to Ganache. Current block number:', blockNumber);
    })
    .catch(error => {
        console.error('Error connecting to Ganache:', error);
    });

//Create express app
const app = express();
app.use(express.json());
app.use(cors());

//CesareDev: create web socket for realt time update
const server = http.createServer(app);
const socket = new Socket(server);

//CesareDev: Middleware to pass web3 to all routes
app.use((req, res, next) => {
    req.web3 = web3;
    next();
});

// Quests interface
const quests = new Quests(web3, fourEverContract, questsDatabase, companiesDatabase, nftsDatabase, socket);

//------------------------------------------
// Market API
//------------------------------------------

// Join Market endpoint
app.post('/api/join-marketplace', (req, res) => {
    market.joinMarketplace(req, res);
});

//------------------------------------------
// Quest API
//------------------------------------------

//CesareDev: Virtually join the quest
//           REQUEST must contain
//           - userAddress
//           - questName
app.post('/api/join-quest', (req, res) => {
    console.log("Join request received");
    quests.joinQuest(req, res);
});

//Andrea: Added endpoint to unjoin a quest, if the quest has not started yet (for testing or should we keep?)
app.post('/api/unjoin-quest', (req, res) => {
    console.log("Unjoin request received");
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
    console.log("Simulate victory request received")
    quests.registerVictory(req, res);
});

// Andrea: Get the NFTs of a user
app.get('/api/get-nfts', async (req, res) => {

    // Andrea: Maybe modify it by first doing checks in the smart contract for nfts consistency

    const address = req.query.address;

    console.log("Get NFTs request received for address: " + address);

    try {
        // Read the nft from the nftsDatabase
        const nfts = await nftsDatabase.asyncFind({ owner: address });
        if (nfts.length > 0) {
            res.status(200).send({
                success: true,
                message: 'NFTs found',
                nfts: nfts,
            });
        }
        else {
            res.status(200).send({
                success: false,
                message: 'No NFTs found',
            });
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500).send( { success: false, message: error.message } );
    }

});

//Andrea: Get the images from the NFTs folder
var mime = { png: 'image/png' };

app.get('*', function (req, res) {
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

//CesareDev: Image generation remove for now
/*
app.post('/api/create-item', async (req, res) => {

    const { address } = req.body;

    const isValid = market.isJoined(address);

    if (isValid) {
        try {
            const newitem = await generator.generateNew(address, items, items_used);
            res.status(200).json({
                message: 'Item created',
                item: newitem.description,
            });
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(400).json({
            message: 'You are not joined to the marketplace',
        });
    }
});
*/

//Andrea: Use Cron to manage quests
cron.schedule('0 0 * * *', () => {
    //Andrea: This function will be executed every day at midnight
    console.log('Updating the quests...');
    quests.handleQuestsLifeCycle();
});

// Start the server
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
