require('dotenv').config({ path: __dirname + '/../.env' });
const path = require("path");
const { Web3 } = require('web3');
var Datastore = require('nedb');

var questsDatabase = new Datastore({ filename: path.join(__dirname, './quests.db'), autoload: true });
var companiesDatabase = new Datastore({ filename: path.join(__dirname, './companies.db'), autoload: true });

//CesareDev: Create / Clean the quest database after usage
questsDatabase.remove({}, { multi: true }, (err) => {
    if (err) {
        console.log({
            success: false,
            message: 'Error',
            body: err
        });
    }
    else {
        questsDatabase.persistence.compactDatafile();
        const quests =
            [
                { "name": "Hunt for the Lost Relic", "description": "Embark on a journey to find the ancient relic hidden deep in the Forbidden Forest.", "startDate": "2024-11-01", "expirationDate": "2024-12-31", "participants": [], "usersThreshold": 5, "questRegistered": false, "questEnded": false, "winner": null },
                { "name": "Save the Princess", "description": "The princess has been kidnapped by the evil wizard. Rescue her from the wizard\'s castle.", "startDate": "2024-10-01", "expirationDate": "2024-10-31", "participants": [], "usersThreshold": 5, "questRegistered": false, "questEnded": false, "winner": null },
                { "name": "Defeat the Dragon", "description": "A fearsome dragon has been terrorizing the kingdom. Slay the dragon and bring peace to the land.", "startDate": "2024-10-15", "expirationDate": "2024-11-15", "participants": [], "usersThreshold": 5, "questRegistered": false, "questEnded": false, "winner": null }
            ];
        questsDatabase.insert(quests, (err, docs) => {
            if (err) {
                console.log({
                    success: false,
                    message: 'Error',
                    body: err
                });
            }
            else if (docs) {
                console.log('====================================');
                console.log('Quests Database:');
                console.log();
                console.log({
                    success: true,
                    message: 'Quests database ready!',
                    body: docs
                });
            }
        });
    }
});

//CesareDev: Create / Clean the companies database after usage
function assign(acc) {
    if (acc.length > 2) {
        companiesDatabase.remove({}, { multi: true }, (err) => {
            if (err) {
                console.log({
                    success: false,
                    message: 'Error',
                    body: err
                });
            }
            else {
                companiesDatabase.persistence.compactDatafile();
                const companies =
                    [
                        { "name": "Blizzard Entertainment", "address": acc[acc.length - 1] },
                        { "name": "Activision", "address": acc[acc.length - 2] },
                        { "name": "Riot Games", "address": acc[acc.length - 3] }
                    ];
                companiesDatabase.insert(companies, function (err, docs) {
                    if (err) {
                        console.log({
                            success: false,
                            message: 'Error',
                            body: err
                        });
                    }
                    else if (docs) {
                        console.log('====================================');
                        console.log('Companies Database:');
                        console.log();
                        console.log({
                            success: true,
                            message: 'Companies database ready!',
                            body: docs
                        });
                    }
                });
            }
        });
    }
}

const web3 = new Web3(process.env.GANACHE);

//CesareDev: Using the above function we can retrieve all the account of the chain
//           and pass them in the assign func
web3.eth.getAccounts().then(assign).catch((err) => { console.log(err) });