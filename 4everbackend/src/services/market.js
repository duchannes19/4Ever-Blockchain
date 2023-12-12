async function joinMarketplace(web3, req, res) {
  require('dotenv').config();

  const { userAddress } = req.body;

  const marketplaceAddress = process.env.MARKETADDR;
  console.log(marketplaceAddress);
  const marketplaceABI = require('../../Truffle/build/contracts/Marketplace.json').abi;

  console.log(userAddress);
  try {
    const marketplaceContract = new web3.eth.Contract(marketplaceABI, marketplaceAddress);

    // Get the return of the contract function
    

    const gasPrice = web3.utils.toWei('20', 'gwei');
    const gasLimit = 6721975;

    const transaction = await marketplaceContract.methods.joinMarketplace().send({
      from: userAddress,
      gasPrice,
      gasLimit,
    });

    console.log('User joined the marketplace:', transaction);
    res.status(200).send({ success: true, transactionHash: transaction.transactionHash, message: 'Joined!' } );
  } catch (error) {
    console.error('Failed to join the marketplace:', error);
    res.send('Operation failed');
  }
}

module.exports = { joinMarketplace };
