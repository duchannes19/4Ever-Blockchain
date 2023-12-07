// marketplaceModule.js
const { ethers } = require('ethers');

const ganacheRpcEndpoint = 'http://127.0.0.1:7545';

const marketplaceAddress = '0x123abc...';
// const marketplaceABI = [...]; // ABI for your Marketplace contract

const privateKey = '0xabcdef...';

async function joinMarketplace() {
  const provider = new ethers.providers.JsonRpcProvider(ganacheRpcEndpoint);
  const wallet = new ethers.Wallet(privateKey, provider);

  const marketplaceContract = new ethers.Contract(marketplaceAddress, marketplaceABI, wallet);

  const userAddress = '0xuseraddress...';

  const transaction = await marketplaceContract.joinMarketplace({
    gasLimit: 200000,
    gasPrice: ethers.utils.parseUnits('20', 'gwei'),
  });

  const receipt = await transaction.wait();

  console.log('User joined the marketplace:', receipt);
}

module.exports = { joinMarketplace };
