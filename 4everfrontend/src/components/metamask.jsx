import { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { toChecksumAddress } from 'web3-utils';
import Web3 from 'web3';

export default function ConnectToMetaMask({ setMetaMask, setIsConnected, setStep1 }) {
    const [count, setCount] = useState(0);
    const [awaitingMetaMask, setAwaitingMetaMask] = useState('Awaiting');

    useEffect(() => {
        const connectToMetaMask = async () => {
            try {
                let isConnected = false;

                // Keep looping until the user connects or cancels
                while (!isConnected) {
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

                            const checksumAddress = toChecksumAddress(accounts[0]);

                            // Get the balance of the connected account
                            const balance = await web3.eth.getBalance(checksumAddress);

                            // Put content on localstorage
                            localStorage.setItem('connected', true);
                            localStorage.setItem('accounts', checksumAddress);
                            localStorage.setItem('balance', balance);

                            document.body.style.height = "auto";

                            setIsConnected(true);
                            setStep1(true);
                            setMetaMask(false);

                            isConnected = true; // Set isConnected to true to break out of the loop
                        } catch (error) {
                            console.error('Error connecting to MetaMask:', error.message);
                            // The user may have closed the popup or rejected the request, continue looping
                        }
                    }
                    // Legacy dapp browsers...
                    else if (window.web3) {
                        // Use Mist/MetaMask's provider
                        const web3 = new Web3(window.web3.currentProvider);
                        console.log('Connected to MetaMask (legacy):', web3);

                        // Add additional logic as needed
                        isConnected = true; // Set isConnected to true to break out of the loop
                    }
                    // Non-dapp browsers...
                    else {
                        alert('Please install MetaMask or use a dapp browser.');
                        break; // Break out of the loop if MetaMask is not available
                    }

                    // Wait for a short duration before the next iteration
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } finally {
                // Ensure that setMetaMask is called even if the loop is broken
                setMetaMask(false);
            }
        };

        connectToMetaMask();
    }, []);

    setInterval(() => {
        if (count < 3) {
            setCount(count + 1);
            setAwaitingMetaMask(awaitingMetaMask + '.');
        } else {
            setCount(0);
            setAwaitingMetaMask('Awaiting');
        }
    }, 1000);

    return (
        <Box className='metamask'>
            <Box className='metamask__content'>
                <Text className='metamask__content__title'>
                    {awaitingMetaMask}
                </Text>
                <Text className='metamask__content__subtitle'>
                    Please make sure you have MetaMask installed.
                </Text>
            </Box>
        </Box>
    );
}