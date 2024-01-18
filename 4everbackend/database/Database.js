require('dotenv').config({ path: __dirname + '/../.env' });
const path = require("path");
const { Web3 } = require('web3');
var Datastore = require('nedb');

var questsDatabase = new Datastore({ filename: path.join(__dirname, './quests.db'), autoload: true });
var companiesDatabase = new Datastore({ filename: path.join(__dirname, './companies.db'), autoload: true });

//CesareDev: Function to assign sponsor and companyaddress to each quest
function assign(acc) {
    if (acc.length > 2) {
        const companies = [
            { "name": "Blizzard Entertainment", "address": acc[acc.length - 1] },
            { "name": "Activision", "address": acc[acc.length - 2] },
            { "name": "Riot Games", "address": acc[acc.length - 3] }
        ];

        companiesDatabase.remove({}, { multi: true }, (err) => {
            if (err) {
                console.log({
                    success: false,
                    message: 'Error',
                    body: err
                });
            } else {
                companiesDatabase.persistence.compactDatafile();
                companiesDatabase.insert(companies, (err, docs) => {
                    if (err) {
                        console.log({
                            success: false,
                            message: 'Error',
                            body: err
                        });
                    } else if (docs) {
                        console.log('====================================');
                        console.log();
                        console.log('Companies database ready!');
                        console.log();
                        console.log(docs.map(doc => doc.name));
                        console.log();

                        // Andrea: Pass the companies to createDatabase function
                        createDatabase(companies);
                    }
                });
            }
        });
    }
}

//CesareDev: Function to create the quest database
function createDatabase(companies) {
    questsDatabase.remove({}, { multi: true }, (err) => {
        if (err) {
            console.log({
                success: false,
                message: 'Error',
                body: err
            });
        } else {
            questsDatabase.persistence.compactDatafile();
            // Andrea: At the moment creates the same quests for each company
            const quests = companies.map((company, index) => ({
                "name": "Hunt for the Lost Relic " + index,
                "description": "Embark on a journey to find the ancient relic hidden deep in the Forbidden Forest.",
                "startDate": "2024-11-01",
                "expirationDate": "2024-12-31",
                "participants": [],
                "usersThreshold": 5,
                "questRegistered": false,
                "questEnded": false,
                "winner": null,
                "sponsor": company.name,
                "companyaddress": company.address
            }));

            questsDatabase.insert(quests, (err, docs) => {
                if (err) {
                    console.log({
                        success: false,
                        message: 'Error',
                        body: err
                    });
                } else if (docs) {
                    console.log('====================================');
                    console.log();
                    console.log('Quests database ready!');
                    console.log();
                    console.log(docs.map(doc => doc.name));
                    console.log();
                }
            });
        }
    });
}

const web3 = new Web3(process.env.GANACHE);

web3.eth.getAccounts().then(assign).catch((err) => { console.log(err) });