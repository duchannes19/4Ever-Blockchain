class NFTsHandler {

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

    async getNFTsByOwner(address, res, status) {
        try {

            // Andrea: Check on the smart contract
            const nftsCheck = await this.contract.methods.getNFTsByOwner(address).call();
            const nfts = nftsCheck.map(nft => this.decimalToHex(nft));

            // Andrea: Check on the database
            console.log("Get NFTs request received for address: " + address);

            // Andrea: Read the nft from the nftsDatabase for each nft in nfts
            const nftsData = await Promise.all(nfts.map(async (nft) => {
                const nftData = await this.nfts.asyncFindOne({ owner: address, tokenID: nft });
                return nftData;
            }));

            res.status(200).json({
                success: true,
                message: 'NFTs retrieved',
                nfts: nftsData,
                status: status ? status : null
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: error.message });
        }
    }

    async handleNFT(req, res) {
        try {
            const tokenID = req.body.tokenID;
            const owner = req.body.owner;

            console.log("Handle NFT request received for tokenID: " + tokenID + " and owner: " + owner);

            const doc = await this.nfts.asyncFindOne({ owner: owner, tokenID: tokenID });

            if (doc) {
                console.log("NFT found in the database");
                console.log(doc);

                const numReplaced = await this.nfts.asyncUpdate(
                    { owner: owner, tokenID: tokenID },
                    { $set: { isForSale: !doc.isForSale } },
                    {}
                );

                if (numReplaced) {
                    this.nfts.persistence.compactDatafile();
                    console.log("NFT updated in the database");
                    console.log(numReplaced);

                    // Andrea: Send the NFTs back to the client with getNFTsByOwner

                    this.getNFTsByOwner(owner, res, !doc.isForSale);

                }
            }
        } catch (err) {
            console.log({
                success: false,
                message: 'Error',
                body: err
            });

            res.status(500).send({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }
}

module.exports = { NFTsHandler };