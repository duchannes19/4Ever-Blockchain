import { useEffect } from 'react';
import Web3 from 'web3';

const ConnectToMetaMask = ({ setMetaMask, setIsConnected }) => {

    useEffect(() => {
        const connectToMetaMask = async () => {
            // Modern dapp browsers...
            if (window.ethereum) {
                try {
                    // Request account access
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    // Web3 instance now connected to MetaMask
                    const web3 = new Web3(window.ethereum);
                    console.log('Connected to MetaMask:', web3);

                    // Put content on localstorage
                    localStorage.setItem('connected', true);
                    localStorage.setItem('web3', web3);
                    localStorage.setItem('address', web3.eth.getAccounts());
                    setIsConnected(true);
                } catch (error) {
                    console.error('Error connecting to MetaMask:', error);
                }
            }
            // Legacy dapp browsers...
            else if (window.web3) {
                // Use Mist/MetaMask's provider
                const web3 = new Web3(window.web3.currentProvider);
                console.log('Connected to MetaMask (legacy):', web3);

                // Add additional logic as needed

            }
            // Non-dapp browsers...
            else {
                alert('Please install MetaMask or use a dapp browser.');
            }
            setTimeout(() => {
                setMetaMask(false);
            }, 1000);
        };

        connectToMetaMask();
    }, []);

    return <div>Connecting to MetaMask...</div>;
};

export default ConnectToMetaMask;
