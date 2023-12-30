//Load environment variables from a .env file into process.env
require('dotenv').config();

//Require modules
const express = require('express');
const cors = require('cors');
const { Web3 } = require('web3');
const { Market } = require('./src/services/Market');
const { Quests } = require('./src/services/Quests');
const { Generator } = require('./src/services/Generator');
const FourEverABI = require('./Truffle/build/contracts/FourEver.json').abi;

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

// Quests interface
const quests = new Quests(web3, fourEverContract);

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

//CesareDev: Example to an endpoint to get all the activeQuest.
//           This can be called, for example, when entering the "Quest" section
app.get('/api/get-all-quest', (req, res) => {
    quests.getActiveQuest(req, res);
});

//CesareDev: DEBUG ONLY END POINT
app.get("/api/submit-quests", (req, res) => {
    quests.submitQuests(req, res);
})

//CesareDev: Example to an endpoint to partecipate to a quest.
//           This can be called, for example, when a user decided to partecipate
//           to a quest (quest identification must be in the request body)
app.post('api/join-quest', (req, res) => {
    quests.joinQuest(req, res);
});

//CesareDev: Catch the quest end event from the contract, not implemented yet
fourEverContract.on("QuestEnded", (event) => {
    //CesareDev: Maybe from the event we can get the questid.
    //           The quest id can be the hash value of the quest description...
    quests.questEnded("replace-with-quest-id");
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

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
