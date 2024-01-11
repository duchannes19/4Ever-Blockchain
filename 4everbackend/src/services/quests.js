const cron = require('node-cron');
const WebSocket = require('ws');
const { randomBytes } = require('crypto');

class Quests {

    //---------------------------------------
    // Constructor
    //---------------------------------------

    constructor(web3, contract, database, companies, socket) {
        this.web3 = web3;
        this.contract = contract;
        this.database = database;
        this.companies = companies;
        this.socket = socket;
    }

    //---------------------------------------
    // Quests
    //---------------------------------------

    getActiveQuest(req, res) {
        //CesareDev: From the nedb doc, passing {} to the find function returns all the entries
        this.database.find({}, (err, docs) => {
            if (err) {
                res.status(500).send({
                    success: false,
                    message: 'Database error',
                    body: err
                });
            }
            else if (docs) {
                res.status(200).send({
                    success: true,
                    message: 'Quests found',
                    quests: docs,
                });
            }
        });
    }

    isUserRegistered(req, res) {
        //CesareDev: Get useraddress from the post request's body
        const { userAddress } = req.body;
        //CesareDev: Check wich quest has this user as a participant
        this.database.find({ participants: userAddress }, (err, docs) => {
            if (err) {
                res.status(500).send({
                    success: false,
                    message: 'Database error',
                    body: err
                });
            }
            else if (docs) {
                res.status(200).send({
                    success: true,
                    message: 'User found',
                    quests: docs
                });
            }
        });
    }

    joinQuest(req, res) {

        //CesareDev: Get useraddress and quest name from the post request's body
        const { userAddress, questName } = req.body;

        //CesareDev: Find the quest id in the database
        const filter = {
            name: 1,
            description: 1,
            startDate: 1,
            expirationDate: 1,
            participants: 1,
            usersThreshold: 1,
            questRegistered: 1,
            _id: 1
        };
        this.database.findOne({ name: questName }, filter, (err, docs) => {
            if (err) {
                res.status(500).send({
                    success: false,
                    message: 'Database error',
                    body: err
                });
            }
            else if (!docs && !err) {
                res.status(404).send({
                    success: false,
                    message: 'Quest ' + questName + ' not found',
                    body: err
                });
            }
            else if (docs) {
                //CesareDev: Add the user address in the entry
                this.database.update({ _id: docs._id }, { $addToSet: { participants: userAddress } }, {}, (err) => {
                    if (err) {
                        res.status(500).send({
                            success: false,
                            message: 'Database error',
                            body: err
                        });
                    }
                    else {
                        res.status(200).send({
                            success: true,
                            message: 'User ' + userAddress + ' added',
                        });
                        this.database.persistence.compactDatafile();
                        this.socket.sendDatabase(this.database);
                    }
                });
            }
        });


    }

    unjoinQuest(req, res) {
        // Andrea: Added function to unjoin a quest, if the quest has not started yet (for testing or should we keep?)
        const { userAddress, questName } = req.body;

        //Andrea: Checks if the user is in the participants list, and if the quest has not started yet, 
        //then removes the user from the list of participants 

        this.database.findOne({ name: questName, participants: userAddress }, (err, docs) => {
            if (err) {
                res.status(500).send({
                    success: false,
                    message: 'Database error',
                    body: err
                });
            } else if (!docs) {
                res.status(404).send({
                    success: false,
                    message: 'User ' + userAddress + ' not found in participants for quest ' + questName,
                });
            } else if (docs.startDate && new Date() >= new Date(docs.startDate)) {
                res.status(400).send({
                    success: false,
                    message: 'Cannot unjoin quest ' + questName + ' as the quest has already started.',
                });
            } else {
                this.database.update({ name: questName }, { $pull: { participants: userAddress } }, {}, (err) => {
                    if (err) {
                        res.status(500).send({
                            success: false,
                            message: 'Database error',
                            body: err
                        });
                    } else {
                        res.status(200).send({
                            success: true,
                            message: 'User ' + userAddress + ' removed from participants for quest ' + questName,
                        });
                        this.database.persistence.compactDatafile();
                        this.socket.sendDatabase(this.database);
                    }
                });
            }
        });
    }

    //---------------------------------------
    // Chain interaction
    //---------------------------------------

    registerQuest(questId) {
        const filter = {
            name: 1,
            participants: 1,
            usersThreshold: 1,
            _id: 1
        };
        this.database.findOne({ _id: questId }, filter, async (err, docs) => {
            if (err) {
                this.socket.sendMessage({
                    success: false,
                    message: 'Quest not found during registration',
                    body: err
                });
            }
            else if (docs) {
                if (docs.participants.length >= docs.usersThreshold) {
                    //CesareDev: quote in wei
                    const quote = 50;
                    for (let i = 0; i < docs.participants.length; i++) {
                        const userBalance = await this.web3.eth.getBalance(docs.participants[i]);
                        if (userBalance < quote * 2) {
                            this.socket.sendMessage({
                                success: false,
                                message: 'One of the user\'s balance insufficient',
                            });
                            return;
                        }
                    }
                    for (let i = 0; i < docs.participants.length; i++) {
                        //CesareDev: The quest and user registration on chain
                        try {
                            const gasPrice = this.web3.utils.toWei('20', 'gwei');
                            const gasLimit = 6721975;
                            //CesareDev: soliditySha3 = keccak256 from the web3.js documentation
                            const questIdHash = this.web3.utils.soliditySha3(docs.name);
                            //CesareDev: secure random seed
                            //           16 bytes -> 128 bit to prevent integer overflow in the contract
                            const seed = this.web3.utils.bytesToHex(randomBytes(16));
                            const questRegistration = await this.contract.methods.joinQuest(questIdHash, seed).send({
                                value: quote,
                                from: docs.participants[i],
                                gasPrice,
                                gasLimit
                            });
                            this.socket.sendMessage({
                                success: true,
                                message: 'User ' + docs.participants[i] + ' joined the quest ' + docs.name,
                                body: questRegistration
                            });
                        } catch (error) {
                            this.socket.sendMessage({
                                success: false,
                                message: 'Error',
                                body: err
                            });
                            return;
                        }
                        //CesareDev: All the users have done the transaction -> quest active
                        this.database.update({ _id: docs._id }, { $set: { questRegistered: true } }, {}, (err) => {
                            if (err) {
                                this.socket.sendMessage({
                                    success: false,
                                    message: 'Database error',
                                    body: err
                                });
                            }
                            else {
                                this.database.persistence.compactDatafile();
                            }
                        });
                    }
                }
            }
        });
    }

    unregisterQuest(questId) {
        //CesareDev: Handle chain unregistration and NFT winning -> set the winner in the db
        const filter = {
            name: 1,
            participants: 1,
            _id: 1
        };
        this.database.findOne({ _id: questId }, filter, async (err, docs) => {
            if (err) {
                this.socket.sendMessage({
                    success: false,
                    message: 'Database error',
                    body: err
                });
            }
            else if (docs) {
                // Andrea: If there is already a winner, we don't have to do anything, just reiterate the winner address
                let winnerAddress;
                let winnerIndex;
                if (!docs.winner) {
                    const questIdHash = this.web3.utils.soliditySha3(docs.name);
                    const seed = await this.contract.methods.getQuestSeed(questIdHash).call();
                    //CesareDev: the index of the winner is in the range [0, participants.length - 1]
                    //           for randomness we do the module with the seed of the quest
                    winnerIndex = this.web3.utils.toNumber(
                        this.web3.utils.toBigInt(seed) % this.web3.utils.toBigInt(docs.participants.length)
                    );
                    winnerAddress = docs.participants[winnerIndex];
                }
                else {
                    winnerAddress = docs.winner;
                }

                //Andrea: Execute the transaction to assign the NFT to the winner


                //Andrea: Finalize the quest by setting the winner in the database
                this.database.update({ _id: docs._id }, { $set: { questEnded: true, winner: winnerAddress } }, {}, (err) => {
                    if (err) {
                        this.socket.sendMessage({
                            success: false,
                            message: 'Database error',
                            body: err
                        });
                    }
                    else {
                        this.socket.sendMessage({
                            success: true,
                            message: 'The winner for ' + docs.name + ' is ' + winnerAddress
                        });
                        this.database.persistence.compactDatafile();
                    }
                })
            }
        });
    };

    // Andrea: Forcefully set the winner of a quest, ending it
    registerVictory(req, res) {
        const { userAddress, questName } = req.body;

        this.database.findOne({ name: questName }, async (err, docs) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Database error',
                    body: err
                });
            }
            if (!docs) {
                return res.status(404).send({
                    success: false,
                    message: 'Quest ' + questName + ' not found'
                });
            }

            const questId = docs._id;

            // Set the winner in the database
            this.database.update({ _id: questId }, { $set: { questEnded: true, winner: userAddress } }, {}, (err) => {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: 'Database error',
                        body: err
                    });
                }
                this.database.persistence.compactDatafile();

                // Handle chain unregistration and NFT winning -> set the winner in the db
                const filter = { name: 1, participants: 1, _id: 1 };
                this.database.findOne({ _id: questId }, filter, async (err, docs) => {
                    if (err) {
                        return res.status(500).send({
                            success: false,
                            message: 'Database error',
                            body: err
                        });
                    }

                    // Execute the transaction to assign the NFT to the winner
                    // To Do

                    // Finalize the quest by setting the winner in the database
                    this.database.update({ _id: docs._id }, { $set: { questEnded: true } }, {}, (err) => {
                        if (err) {
                            return res.status(500).send({
                                success: false,
                                message: 'Database error',
                                body: err
                            });
                        }
                        res.status(200).send({
                            success: true,
                            message: 'The winner for ' + docs.name + ' is ' + userAddress
                        });
                        this.database.persistence.compactDatafile();
                        this.socket.sendDatabase(this.database);
                    });
                });
            });
        });
    };

    //---------------------------------------
    // Scheduler
    //---------------------------------------

    handleQuestsLifeCycle() {
        // Andrea: Implement your logic to execute quests here
        console.log('---------------------------------------');
        console.log('Managing quests...');

        // Andrea: Get all the active quests from the database
        this.database.find({}, (err, docs) => {
            if (err) {
                this.socket.sendMessage({
                    success: false,
                    message: 'Database error',
                    body: err
                });
            }
            else if (docs) {
                const todayDate = new Date();
                this.startQuests(todayDate);
                this.endQuests(todayDate);
            }
        });
    }

    startQuests(todayDate) {
        // Andrea: Check if there is any quest that starts today
        const todayStartQuests = docs.filter((quest) => {
            const questDate = new Date(quest.startDate);
            return questDate.getDate() === todayDate.getDate() && questDate.getMonth() === todayDate.getMonth() && questDate.getFullYear() === todayDate.getFullYear();
        });
        // Andrea: If there are quests that start today, schedule a cron job for each of them to start at 8:00 AM
        if (todayStartQuests.length > 0) {
            todayStartQuests.forEach((quest) => {
                cron.schedule('0 8 * * *', () => {
                    // Andrea: This function will be executed once at 8:00 AM of the current day
                    console.log('Starting quest:', quest.name);
                    // Andrea: The quest has started, so we can update it from the active quests and set the status to true in questRegistered in the database
                    //CesareDev: Here logic handling the start of the quests
                    this.registerQuest(quest._id);
                    this.socket.sendDatabase(this.database);
                }, {
                    scheduled: false, // Andrea: Don't start immediately
                    timezone: 'Europe/Rome', // Andrea: Set the timezone to Europe/Rome
                });

                // Andrea: Schedule the job to start
                cron.getTasks({ timezone: 'Europe/Rome' })['0 8 * * *'].start();
            });
        }
    }

    // Andrea: IMPORTANT: Actually there should be a logic that acknowledges the user who finish the quest and immediatly handles
    // the payment of the NFT to the user. This logic should be implemented in the function unregisterQuests(questId) adding the user address that finished first.

    endQuests(todayDate) {
        // Andrea: Check if there is any quest that ends today
        // Andrea: If there are quests that end today, schedule a cron job for each of them to end at 23:00 PM
        const todayEndQuests = activeQuests.filter((quest) => {
            const questDate = new Date(quest.expirationDate);
            return questDate.getDate() === todayDate.getDate() && questDate.getMonth() === todayDate.getMonth() && questDate.getFullYear() === todayDate.getFullYear();
        });

        if (todayEndQuests.length > 0) {
            todayEndQuests.forEach((quest) => {
                cron.schedule('0 23 * * *', () => {
                    // Andrea: This function will be executed once at 23:00 PM of the current day
                    console.log('Ending quest:', quest.name);
                    // Andrea: The quest has ended, so we can update it from the active quests and modify the field questEnded in the database
                    this.unregisterQuest(quest._id);
                    this.socket.sendDatabase(this.database);
                }, {
                    scheduled: false, // Andrea: Don't start immediately
                    timezone: 'Europe/Rome', // Andrea: Set the timezone to Europe/Rome
                });

                // Andrea: Schedule the job to start
                cron.getTasks({ timezone: 'Europe/Rome' })['0 23 * * *'].start();
            });
        }
    }

    //---------------------------------------
    // Utils
    //---------------------------------------

    getCompanies(){
        //Andrea: Fetch the companies addresses from companies database
        const companies = this.companies.find({}, (err, docs) => {
            if (err) {
                console.log(err);
            }
            else if (docs) {
                return docs;
            }
        });

        return companies;
    }
}

module.exports = { Quests };
