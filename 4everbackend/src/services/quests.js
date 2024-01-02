const questsList = require('../../quests/quests.json');

class Quests {

    constructor(web3, contract) {
        this.web3 = web3;
        this.contract = contract;
    }

    async getActiveQuest(req, res) {
        return questsList.quests;
    }

    async joinQuest(req, res) {
        //CesareDev: call this func when a user want to partecipate to a quest, 
        //           in the request must be the quest "index" o the quest "identificator"
        //           that the contract handles to register the user

        const { userAddress, questIndex } = req.body;
        try {
            const gasPrice = this.web3.utils.toWei('20', 'gwei');

            //CesareDev: Hard coded quote for partecipate to quest
            const quote = this.web3.utils.toWei('50', 'gwei');
            const gasLimit = 6721975;

            //CesareDev: soliditySha3 = keccak256 form the web3.js documentation
            const questIdHash = this.web3.utils.soliditySha3(questsList.quests[questIndex].name);
            const alreadyRegister = await this.contract.methods.isAlreadyRegistered(questIdHash, userAddress).call();
            if (alreadyRegister) {
                //CesareDev: 409 Conflict response status
                res.status(409).send({
                    message: "User already registered"
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
                message: 'User added!'
            });
        } catch (error) {
            console.error('Failed to join the quest:', error);
            res.status(500).send('Operation failed');
        }
    }

    async questEnded(questId) {
        //CesareDev: Handle the questEnded event from the smart contract
    }

}

module.exports = { Quests };
