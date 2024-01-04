//CesareDev: Add this to access WebSocket.OPEN
const WebSocket = require('ws');

class Quests {

    constructor(web3, contract, database, clients) {
        this.web3 = web3;
        this.contract = contract;
        this.database = database;
        this.clients = clients;
    }

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
                        this.socketSendUserJoinedMessage();
                    }
                });
            }
        });

        /* CesareDev: The registration on chain in delayed
        try {
            const gasPrice = this.web3.utils.toWei('20', 'gwei');
            const gasLimit = 6721975;

            //CesareDev: Hard coded quote for partecipate to a quest
            const quote = this.web3.utils.toWei('50', 'gwei');

            //CesareDev: soliditySha3 = keccak256 form the web3.js documentation
            const questIdHash = this.web3.utils.soliditySha3(questsList.quests[questIndex].name);

            const alreadyRegister = await this.contract.methods.isAlreadyRegistered(questIdHash, userAddress).call();
            if (alreadyRegister) {
                //CesareDev: 409 Conflict response status, the responde object can be
                //           modified         
                res.status(409).send({
                    message: "User already registered to this quest"
                });
                return;
            }
            const questRegistration = await this.contract.methods.joinQuest(questIdHash).send({
                value: quote,
                from: userAddress,
                gasPrice,
                gasLimit
            });
            res.status(200).send({
                message: 'User added to this quest'
            });
        } catch (error) {
            console.error('Failed to join the quest:', error);
            res.status(500).send('Operation failed');
        }
        */
    }

    // Andrea: Added function to unjoin a quest, if the quest has not started yet (for testing or should we keep?)
    unjoinQuest(req, res) {

        const { userAddress, questName } = req.body;

        //Andrea: Checks if the user is in the participants list, and if the quest has not started yet, 
        //then removes the user from the list of participants 

        this.database.findOne({ name: questName, participants: userAddress }, (err, quest) => {
            if (err) {
                res.status(500).send({
                    success: false,
                    message: 'Database error',
                    body: err
                });
            } else if (!quest) {
                res.status(404).send({
                    success: false,
                    message: 'User ' + userAddress + ' not found in participants for quest ' + questName,
                });
            } else if (quest.startDate && new Date() >= new Date(quest.startDate)) {
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
                        this.socketSendUserJoinedMessage();
                    }
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

    socketSendMessage(message) {
        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }

    socketSendUserJoinedMessage() {
        //CesareDev: if successfully updated the quest send, via websocket,
        //           an event to the clients containing the updated entry
        this.database.find({}, (err, docs) => {
            if (err) {
                this.socketSendMessage({
                    success: false,
                    message: 'Quests not found',
                    body: err
                });
            }
            else if (docs) {
                this.socketSendMessage({
                    success: true,
                    message: 'Quests found',
                    quests: docs
                });
            }
        });
    }

    tryRegisterQuest(questName) {
        const filter = {
            participants: 1,
            usersThreshold: 1,
            _id: 1
        };
        this.database.findOne({ name: questName }, filter, async (err, docs) => {
            if (err) {
                console.log(err);
                /*
                this.socketSendMessage({
                    success: false,
                    message: 'Quest not found',
                    body: err
                });
                */
            }
            else if (docs) {
                if (docs.participants.length >= docs.usersThreshold) {
                    const userBalance = await this.web3.eth.getBalance('0x5C3987870A109526291644E9161EbFC5ca1184BA');
                    const userBalanceDecimal = this.web3.toDecimal(userBalance);
                    console.log(userBalanceDecimal);
                }
            }
        });
    }
}
module.exports = { Quests };
