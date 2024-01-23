import { toChecksumAddress } from 'web3-utils';
import Web3 from 'web3';

const MetaMaskHelper = async (setIsConnected, setStep1, setStep2, setMarket, setQuests, setMetaMask) => {
 
    // Andrea: Set up event listener for account changes
    window.ethereum.on('accountsChanged', async (accounts) => {
        try {
            const web3 = new Web3(window.ethereum);

            console.log('Checking Accounts...')
            const checksumAddress = toChecksumAddress(accounts[0]);

            // Andrea: Update local storage or perform actions based on the new account
            localStorage.clear();

            // Andrea: Get the balance of the connected account
            const balance = await web3.eth.getBalance(checksumAddress);

            // Andrea: Convert balance to Ether
            const balanceInEther = web3.utils.fromWei(balance, 'ether');

            // Andrea: Put content on localstorage
            localStorage.setItem('connected', true);
            localStorage.setItem('accounts', checksumAddress);
            localStorage.setItem('balance', balanceInEther);

            document.body.style.backgroundImage = 'url("/img/mainback.png")';
            document.body.style.height = "auto";

            setStep2(false);
            setMarket(false);
            setQuests(false);

            setStep1(true);
            setIsConnected(true);

            console.log('Account changed:', accounts[0]);
        } catch (error) {
            console.log('Test');
            localStorage.clear();
            setIsConnected(false);
            setStep1(false);
            setStep2(false);
            setMarket(false);
            setQuests(false);
            setMetaMask(false);
            console.error(error);
        }
    });
};

export default MetaMaskHelper;