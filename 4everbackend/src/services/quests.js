const fs = require('fs');

class Quests {
    constructor(web3, contract, quests) {
        this.web3 = web3;
        this.contract = contract;
        this.quests = quests.quests;
    }

    getRandomQuest() {
        // Choose a random quest
        return this.quests[Math.floor(Math.random() * this.quests.length)];
    }

    // Example: Assign a quest to a user
    async assignQuest(req, res) {
        const { address } = req.body;

        // Choose a random quest
        const quest = this.getRandomQuest();
        // Andrea: add logic to save the quest to the blockchain and assign it to the user with the smart contract
        console.log(`Assigning quest "${quest.name}" to user at address ${address}`);
        // Placeholder return
        return res.status(200).send({ success: true, message: 'Quest assigned to user.', quest: quest });
    }


    // Andrea: Example to handle completion and save to blockchain, add logic to the smart contract
    completeQuest(userAddress, questName) {
        // Andrea: add logic to save the completion of the quest to the blockchain
        console.log(`Recording completion of quest "${questName}" for user at address ${userAddress}`);
        // Placeholder return
        return { success: true, message: 'Quest completed and recorded on the blockchain.' };
    }
}

module.exports = { Quests };
