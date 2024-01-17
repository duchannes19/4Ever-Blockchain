class Market {

    constructor(web3, contract, nfts) {
        this.web3 = web3;
        this.contract = contract;
        this.nfts = nfts;
    }

    decimalToHex(decimalValue) {
        // Andrea: Convert the decimal value to a hexadecimal string
        const hexString = decimalValue.toString(16);

        // Andrea: Add the '0x' prefix
        const prefixedHexString = '0x' + hexString;

        return prefixedHexString;
    }

    async joinMarketplace(req, res) {
        const { userAddress } = req.body;
        try {
            const gasPrice = this.web3.utils.toWei('20', 'gwei');
            const gasLimit = 6721975;
            const verifyMembership = await this.contract.methods.isUserMember(userAddress).call();
            if (verifyMembership) {
                console.log('User is already a member');

                // Get the user's NFTs
                let nfts = await this.contract.methods.getNFTsByOwner(userAddress).call();

                if (nfts.length === 0) {
                    nfts = ['None'];
                }

                console.log('NFTs:', nfts.map(nft => nft.toString()));

                res.status(200).send({
                    success: true,
                    nfts: nfts.map(nft => nft.toString()),
                    message: 'Welcome Back!'
                });
                return;
            }
            const transaction = await this.contract.methods.joinMarketplace().send({
                from: userAddress,
                gasPrice,
                gasLimit,
            });
            console.log('User joined the marketplace:', transaction);

            // Get the user's NFTs
            // Andrea: still don't know if this is the correct way to get an NFT
            let nfts = await this.contract.methods.getNFTsByOwner(userAddress).call();

            if (nfts.length === 0) {
                nfts = ['None'];
            }

            console.log('NFTs:', nfts.map(nft => nft.toString()));

            res.status(200).send({
                success: true,
                transactionHash: transaction.transactionHash,
                nfts: nfts.map(nft => nft.toString()),
                message: 'Joined!'
            });

        } catch (error) {
            console.error('Failed to join the marketplace:', error);
            res.status(500).send('Operation failed');
        }
    };

    async getNFTsByOwner(address) {
        try {

            // Andrea: Check on the smart contract
            const nftsCheck = await this.contract.methods.getNFTsByOwner(address).call();
            const nfts = nftsCheck.map(nft => this.decimalToHex(nft));

            // Andrea: Read the nft from the nftsDatabase for each nft in nfts
            const nftsData = await Promise.all(nfts.map(async (nft) => {
                const nftData = await this.nfts.asyncFindOne({ owner: address, tokenID: nft, isForSale: true });
                return nftData;
            }));

            return nftsData;
        } catch (error) {
            console.log(error);
        }
    }

    async getMerchants(res) {
        console.log('Get merchants request received')

        // Andrea: First get all the members of the marketplace
        const members = await this.contract.methods.getAllUsers().call();

        // Andrea: For each member, check in the nfts database (owner field) his nfts that are set as isForSale === true
        // Andrea: I reconstructed the same structure we use for debug in the client
        // Andrea: I used the two function from NFTsHandler.js modified
        const merchants = [];
        for (const member of members) {
            const nfts = await this.getNFTsByOwner(member.toString().toLowerCase());
            merchants.push({ address: member.toString().toLowerCase(), items: nfts });
        };

        res.status(200).send({ success: true, merchants: JSON.stringify(merchants) });
    }

    async isJoined(userAddress) {
        try {
            const isMember = await this.contract.methods.isUserMember(userAddress).call();
            return isMember;
        } catch (error) {
            console.error('Failed to check if user is joined:', error);
            return false;
        }
    };
}

module.exports = { Market };