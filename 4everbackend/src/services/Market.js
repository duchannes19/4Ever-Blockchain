class Market {

    //---------------------------------------
    // Constructor
    //---------------------------------------

    constructor(web3, contract, socket) {
        this.web3 = web3;
        this.contract = contract;
        this.socket = socket;
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
    // Market
    //---------------------------------------

    async joinMarketplace(req, res) {
        const { userAddress } = req.body;
        try {
            const verifyMembership = await this.contract.methods.isUserMember(userAddress).call();
            if (verifyMembership) {
                console.log('[Market]:' + userAddress + ' already a member');

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
            const gasPrice = this.web3.utils.toWei('20', 'gwei');
            const gasLimit = 6721975;
            const transaction = await this.contract.methods.joinMarketplace().send({
                from: userAddress,
                gasPrice,
                gasLimit,
            });
            console.log('[Market]: \x1b[32mJoin\x1b[0m user: ' + userAddress);

            // Get the user's NFTs
            // Andrea: still don't know if this is the correct way to get an NFT
            let nfts = await this.contract.methods.getNFTsByOwner(userAddress).call();

            if (nfts.length === 0) {
                nfts = ['None'];
            }

            res.status(200).send({
                success: true,
                transactionHash: transaction.transactionHash,
                nfts: nfts.map(nft => nft.toString()),
                message: 'Joined!'
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Operation failed');
        }
    };

    async getMerchants(req, res) {
        try {
            const allNFTs = await this.contract.methods.getSellNFTs().call();

            //Andrea: remap the nfts to create the correct merchants structure

            const merchants = [];
            allNFTs.forEach(item => {
                const address = item.owner;
                const rarity = this.convertRarityToString(item.rarity);
                const id = item.id.toString();
                const url = '/NFTs//' + item.url.split('\\').slice(-1)[0];
                const nfts = { name: item.name, image: url, rarity: rarity, id: id, owner: address };

                // Check if address already exists in merchants array
                const existingMerchant = merchants.find(merchant => merchant.address === address);
                if (existingMerchant) {
                    existingMerchant.items.push(nfts); // Add nfts to existing merchant
                } else {
                    merchants.push({ address, items: [nfts] }); // Create new merchant entry
                }
            });

            res.status(200).send(JSON.stringify({
                success: true,
                message: 'Merchants retrieved',
                merchants: merchants,
            }));
        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: error.message });
        };
    };

    async getNFTs(req, res) {
        const address = req.query.address;
        try {
            // Andrea: Check on the smart contract
            const nftsCheck = await this.contract.methods.getNFTs(address).call();
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
                status: nftsData.onSale ? 'On Sale' : 'Not On Sale',
            }));
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: error.message
            });
        };
    };

    //---------------------------------------
    // Buying and selling (TODO)
    //---------------------------------------

    async buyNFT(req, res) {
        const { buyerAddress, tokenId } = req.body;
        const tokenIdBigInt = this.web3.utils.toBigInt(tokenId);
        const gasPrice = this.web3.utils.toWei('20', 'gwei');
        const gasLimit = 6721975;
        //CesareDev: For now the NFT value is fixed to 2 ether 
        const NFTvalue = this.web3.utils.toWei('2', 'ether');
        try {
            await this.contract.methods.buyNFT(tokenIdBigInt).send({
                value: NFTvalue,
                from: buyerAddress,
                gasPrice,
                gasLimit
            });
            console.log('[Market]: ' + buyerAddress + ' bought ' + tokenId);
        }
        catch (err) {
            console.log(err);
        }
    }

    async sellNFT(req, res) {
        const { userAddress, tokenId } = req.body;
        const tokenIdBigInt = this.web3.utils.toBigInt(tokenId);
        const gasPrice = this.web3.utils.toWei('20', 'gwei');
        const gasLimit = 6721975;
        try {
            await this.contract.methods.sellNFT(tokenIdBigInt).send({
                from: userAddress,
                gasPrice,
                gasLimit
            });
            console.log('[Market]: ' + userAddress + ' puts up for sale ' + tokenId);
        }
        catch (err) {
            console.log(err);
        }
    }

    async unsellNFT(req, res) {
        const { userAddress, tokenId } = req.body;
        const tokenIdBigInt = this.web3.utils.toBigInt(tokenId);
        const gasPrice = this.web3.utils.toWei('20', 'gwei');
        const gasLimit = 6721975;
        try {
            await this.contract.methods.unsellNFT(tokenIdBigInt).send({
                from: userAddress,
                gasPrice,
                gasLimit
            });
            console.log('[Market]: ' + userAddress + ' removes for sale ' + tokenId);
        }
        catch (err) {
            console.log(err);
        }
    }
}

module.exports = { Market };