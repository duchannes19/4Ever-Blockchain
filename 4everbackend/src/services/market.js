class Market {

    constructor(web3, contract) {
        this.web3 = web3;
        this.contract = contract;
    }

    async joinMarketplace(req, res) {
        const { userAddress } = req.body;
        try {
            const gasPrice = this.web3.utils.toWei('20', 'gwei');
            const gasLimit = 6721975;
            const verifyMembership = await this.contract.methods.isUserMember(userAddress).call();
            if (verifyMembership) {
                console.log('User is already a member');
                res.status(200).send({ success: true, message: 'User is already a member' });
                return;
            }
            const transaction = await this.contract.methods.joinMarketplace().send({
                from: userAddress,
                gasPrice,
                gasLimit,
            });
            console.log('User joined the marketplace:', transaction);
            res.status(200).send({ success: true, transactionHash: transaction.transactionHash, message: 'Joined!' });
        } catch (error) {
            console.error('Failed to join the marketplace:', error);
            res.status(500).send('Operation failed');
        }
    }
}

module.exports = { Market };