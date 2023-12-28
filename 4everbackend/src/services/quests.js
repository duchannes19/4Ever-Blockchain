class Quests {

    constructor(web3, contract, quests) {
        this.web3 = web3;
        this.contract = contract;
        this.quests = quests.quests;
    }

    async getActiveQuest(req, res) {
        //CesareDev: return all active quest
    }

    async partecipateToAQuest(req, res) {
        //CesareDev: call this func when a user want to partecipate to a quest, 
        //           in the request must be the quest "index" o the quest "identificator"
        //           that the contract handles to register the user
    }

    async questEnded(questId) {
        //CesareDev: Handle the questEnded event from the smart contract
    }

}

module.exports = { Quests };
