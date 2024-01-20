class NFTsHandler {

    constructor(web3, contract) {
        this.web3 = web3;
        this.contract = contract;
    }

    //---------------------------------------
    // Utils
    //---------------------------------------

    convertRarityToString(numericRarity) {
        switch (numericRarity) {
            case 0n:
                return 'Common';
            case 1n:
                return 'Uncommon';
            case 2n:
                return 'Rare';
            case 3n:
                return 'Epic';
            case 4n:
                return 'Legendary';
            default:
                return 'Unknown Rarity';
        }
    };

    //---------------------------------------
    // NFTs API
    //---------------------------------------

    async getNFTsByOwner(req, res) {
        //CesareDev: (TODO) Watch out for the status, i left the default value like in the previosu version
        const address = req.query.address;
        const status = false;
        try {
            // Andrea: Check on the smart contract
            const nftsCheck = await this.contract.methods.getNFTsByOwner(address).call();
            //CesareDev: TODO parse the return tuple from the contract

            // Andrea: remap the NFTs to include the wanted properties
            const nftsData = nftsCheck.map(nft => {
                // Andrea: remap the URL to get the correct path
                const url = '/NFTs//' + nft.url.split('\\').slice(-1)[0];
                const rarity = this.convertRarityToString(nft.rarity);

                return {
                    id: nft.id.toString(),
                    name: nft.name,
                    image: url,
                    owner: nft.owner,
                    company: nft.company,
                    rarity: rarity,
                    isForSale: nft.onSale,
                }
            });

            res.status(200).send(JSON.stringify({
                success: true,
                message: 'NFTs retrieved',
                nfts: nftsData,
                status: status ? 'On Sale' : 'Not On Sale',
            }));


        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: error.message });
        };
    };

    async handleNFTs(req, res) {
        const address = req.body.address;
        const tokenID = req.body.tokenID;
        const status = req.body.status;
        // Andrea: Convert the tokenID to a bigInt with web3
        tokenID = this.web3.utils.toBigInt(tokenID);
        try {
            if (status) {
                await this.contract.methods.setNFTsNotOnSale(address, tokenID).send({
                    from: address,
                    gasPrice: this.web3.utils.toWei('20', 'gwei'),
                    gasLimit: 6721975,
                });
            }
            else {
                await this.contract.methods.setNFTsOnSale(address, tokenID).send({
                    from: address,
                    gasPrice: this.web3.utils.toWei('20', 'gwei'),
                    gasLimit: 6721975,
                });
            }

            return this.getNFTsByOwner(address, true, res);
        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: error.message });
        }
    };
}

module.exports = { NFTsHandler };