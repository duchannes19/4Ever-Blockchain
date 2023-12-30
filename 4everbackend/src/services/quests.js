const questsList = require('../../quests/quests.json');

class Quests {

    constructor(web3, contract, quests) {
        this.web3 = web3;
        this.contract = contract;
    }

    async submitQuests(req, res) {
        //CesareDev: Old style for loop -> more readible for me, feel free to change :)
        for (let i = 0; i < questsList.quests.length; i++) {

            //CesareDev: soliditySha3 = keccak256 form the web3.js documentation
            let questIdHash = this.web3.utils.soliditySha3(questsList.quests[i].name);

            //CesareDev: To change contract state we need a real transaction,
            //           the function call isn't enought...
            //           Who register the quests??????
            let questRegistration = await this.contract.methods.registerQuest(questIdHash).call();
            if (questRegistration)
                console.log(questsList.quests[i].name + " registered!");
            else
                console.log(questsList.quests[i].name + " already registered!");
        }

        //CesareDev: DEBUG ONLY
        res.status(200).send({
            message: "okay!"
        });
    }

    async getActiveQuest(req, res) {
        return questsList.quests;
    }

    async joinQuest(req, res) {
        //CesareDev: call this func when a user want to partecipate to a quest, 
        //           in the request must be the quest "index" o the quest "identificator"
        //           that the contract handles to register the user
    }

    async questEnded(questId) {
        //CesareDev: Handle the questEnded event from the smart contract
    }

}

module.exports = { Quests };
