class NFTsHandler {

    constructor(web3, contract) {
        this.web3 = web3;
        this.contract = contract;
    }

    async getNFTsByOwner(address, res, status) {
        try {

            // Andrea: Check on the smart contract
            const nftsCheck = await this.contract.methods.getNFTsByOwner(address).call();
            console.log(nftsCheck);
            //CesareDev: TODO parse the return tuple from the contract

            /*
            res.status(200).json({
                success: true,
                message: 'NFTs retrieved',
                nfts: nftsData,
                status: status ? status : null
            });
            */
        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: error.message });
        }
    }
}

module.exports = { NFTsHandler };