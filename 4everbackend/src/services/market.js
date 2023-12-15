async function joinMarketplace(web3, req, res, contract) {

    const { userAddress } = req.body;

    console.log(userAddress);
    try {

        const gasPrice = web3.utils.toWei('20', 'gwei');
        const gasLimit = 6721975;

        const verifyMembership = await contract.methods.isMember(userAddress).call();

        if (verifyMembership) {
            console.log('User is already a member');
            res.status(200).send({ success: true, message: 'User is already a member' });
            return;
        }

        const transaction = await contract.methods.joinMarketplace().send({
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

module.exports = { joinMarketplace };