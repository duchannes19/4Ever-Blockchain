import { toChecksumAddress } from 'web3-utils';
import Web3 from 'web3';

const MetaMaskHelper = async (setIsConnected, setStep1, setStep2, setMarket, setQuests, setMetaMask) => {

    // Andrea: Set up event listener for account changes
    window.ethereum.on('accountsChanged', async (accounts) => {
        try {
            // Andrea: Check the network is Ganache local
            const web3 = new Web3(window.ethereum);
            /*
            const network = await web3.eth.net.getNetworkType();
            console.log('Network:', network);
            if (network !== 'private') {
                alert('Please connect to the Ganache network!');
                localStorage.clear();
                setIsConnected(false);
                setStep1(false);
                setStep2(false);
                setMarket(false);
                setQuests(false);
                setMetaMask(false);
                return;
            }
            */
            
            console.log('Checking Accounts...')
            const checksumAddress = toChecksumAddress(accounts[0]);

            // Andrea: Get the balance of the connected account
            const balance = await web3.eth.getBalance(checksumAddress);

            // Andrea: Update local storage or perform actions based on the new account
            localStorage.clear();
            localStorage.setItem('connected', true);
            localStorage.setItem('accounts', checksumAddress);
            localStorage.setItem('balance', balance);

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