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

                // Get the user's balance
                const balance = await this.contract.methods.balanceOf(userAddress).call();
                console.log('Balance:', balance.toString());

                // Get the user's NFTs
                let nfts = await this.contract.methods.getUserNFTs(userAddress).call();
                
                if (nfts.length === 0) {
                    nfts = ['None'];
                }
                
                console.log('NFTs:', nfts.map(nft => nft.toString()));

                res.status(200).send({
                    success: true,
                    balance: balance.toString(),
                    nfts: nfts.map(nft => nft.toString()),
                    message: 'Welcome Back!' });
                return;
            }
            const transaction = await this.contract.methods.joinMarketplace().send({
                from: userAddress,
                gasPrice,
                gasLimit,
            });
            console.log('User joined the marketplace:', transaction);

            // Get the user's balance
            const balance = await this.contract.methods.balanceOf(userAddress).call();
            console.log('Balance:', balance.toString());

            // Get the user's NFTs
            let nfts = await this.contract.methods.getUserNFT(userAddress).call();

            if (nfts.length === 0) {
                nfts = ['None'];
            }

            console.log('NFTs:', nfts.map(nft => nft.toString()));

            res.status(200).send({
                success: true,
                transactionHash: transaction.transactionHash,
                balance: balance.toString(),
                nfts: nfts.map(nft => nft.toString()),
                message: 'Joined!'
            });

        } catch (error) {
            console.error('Failed to join the marketplace:', error);
            res.status(500).send('Operation failed');
        }
    };

    async addNFT(userAddress) {
        try {
            const nftId = Math.floor(Math.random() * 1000); // Generate random nftId
            const transaction = await this.contract.methods.AddNFTtoUser(userAddress, nftId).send({
                from: userAddress,
            });
            console.log('NFT added:', transaction);
            res.status(200).send({ success: true, transactionHash: transaction.transactionHash, message: 'NFT Added!' });
        } catch (error) {
            console.error('Failed to add NFT:', error);
            res.status(500).send('Operation failed');
        }
    };
}

module.exports = { Market };