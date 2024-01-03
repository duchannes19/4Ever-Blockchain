class Quests {

    constructor(web3, contract, database) {
        this.web3 = web3;
        this.contract = contract;
        this.database = database;
    }

    getActiveQuest(req, res) {
        //CesareDev: From the nedb doc, passing {} to the find function returns all the entries
        this.database.find({}, (err, docs) => {
            if (docs) {
                res.status(200).send(docs);
            }
            else {
                res.status(500).send({
                    message: 'Database error',
                    body: err
                });
            }
        });
    }

    joinQuest(req, res) {
        //CesareDev: Get useraddress and quest name from the post request's body
        const { userAddress, questName } = req.body;

        //CesareDev: Find the quest id in the database
        const filter = { name: 1, expirationDate: 1, description: 1, participants: 1, usersThreshold: 1, _id: 1 };
        this.database.findOne({ name: questName }, filter, (err, docs) => {
            if (docs) {
                const usersNum = docs.participants.length;
                //CesareDev: Add the user address in the entry
                this.database.update({ _id: docs._id }, { $addToSet: { participants: userAddress } }, {}, (err) => {
                    if (err) {
                        res.status(500).send('Database error');
                    }
                    else {
                        res.status(200).send({
                            message: 'User ' + userAddress + ' added',
                        });
                        this.database.persistence.compactDatafile();
                    }
                });
            }
            else {
                res.status(500).send({
                    message: 'Database error',
                    body: err
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

    isUserRegistered(req, res) {
        //CesareDev: Get useraddress from the post request's body
        const { userAddress } = req.body;
        //CesareDev: Check wich quest has this user as a participant
        this.database.find({ participants: userAddress }, (err, docs) => {
            if (docs) {
                res.status(200).send(docs);
            }
            else {
                res.status(500).send({
                    message: 'Database error',
                    body: err
                })
            }
        });
    }
}
module.exports = { Quests };
