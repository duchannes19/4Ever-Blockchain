import { useEffect } from 'react';
import Web3 from 'web3';

export default function ConnectToMetaMask({ setMetaMask, setIsConnected, setStep1 }) {

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
                    const accounts = await window.ethereum.request({
                        method: 'eth_accounts',
                    });

                    // Put content on localstorage
                    localStorage.setItem('connected', true);
                    localStorage.setItem('accounts', accounts[0]);
                    setIsConnected(true);
                    setStep1(true);
                    setMetaMask(false);
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
        };

        connectToMetaMask();
    }, []);

    return <div>Connecting to MetaMask...</div>;
}
