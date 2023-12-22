//Load environment variables from a .env file into process.env
require('dotenv').config();

//Require modules
const express = require('express');
const cors = require('cors');
const { Web3 } = require('web3');
const { Market } = require('./src/services/Market');
const { Quests } = require('./src/services/quests');
const generatenew = require('./src/services/generation');
const FourEverABI = require('./Truffle/build/contracts/FourEver.json').abi;

const items = require('./items/unused.json');
const items_used = require('./items/used.json'); 
const quests_list = require('./quests/quests.json');

//Connect to Ganache
const web3 = new Web3(process.env.GANACHE);

//Contract instance
const fourEverContract = new web3.eth.Contract(FourEverABI, process.env.MARKETADDR);

//Market interface
const market = new Market(web3, fourEverContract);

// Quests interface
const quests = new Quests(web3, fourEverContract, quests_list);

//Create express app
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

// Join Market endpoint
app.post('/api/join-marketplace', (req, res) => {
    //Call class method to join the market
    market.joinMarketplace(req, res);
});

// Assign a quest to a user
app.post('/api/assign-quest', (req, res) => {
    //Call class method to assign a quest
    quests.assignQuest(req, res);
});

app.post('/api/create-item', async (req, res) => {

    const { address } = req.body;

    const isValid = market.isJoined(address);

    if (isValid) {
        try {
            const newitem = await generatenew(address, items, items_used);
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


// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
