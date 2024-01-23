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

                // Andrea: Keep looping until the user connects or cancels
                while (!isConnected) {
                    // Andrea: Modern dapp browsers...
                    if (window.ethereum) {
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
                                setMetaMask(false);
                                break; // Andrea: Break out of the loop if the network is not Ganache
                            }
                            */
                            
                            // Andrea: Request account access
                            await window.ethereum.request({ method: 'eth_requestAccounts' });

                            // Andrea: Web3 instance now connected to MetaMask
                            console.log('Connected to MetaMask:', web3);

                            const accounts = await window.ethereum.request({
                                method: 'eth_accounts',
                            });

                            const checksumAddress = toChecksumAddress(accounts[0]);

                            // Andrea: Get the balance of the connected account
                            const balance = await web3.eth.getBalance(checksumAddress);

                            // Andrea: Convert balance to Ether
                            const balanceInEther = web3.utils.fromWei(balance, 'ether');

                            // Andrea: Put content on localstorage
                            localStorage.setItem('connected', true);
                            localStorage.setItem('accounts', checksumAddress);
                            localStorage.setItem('balance', balanceInEther);

                            document.body.style.height = "auto";

                            setIsConnected(true);
                            setStep1(true);
                            setMetaMask(false);

                            isConnected = true; // Andrea: Set isConnected to true to break out of the loop
                        } catch (error) {
                            console.error('Error connecting to MetaMask:', error.message);
                            // Andrea: The user may have closed the popup or rejected the request, continue looping
                        }
                    }
                    // Andrea: Legacy dapp browsers...
                    else if (window.web3) {
                        // Andrea: Use Mist/MetaMask's provider
                        const web3 = new Web3(window.web3.currentProvider);
                        console.log('Connected to MetaMask (legacy):', web3);

                        // Andrea: Add additional logic as needed
                        isConnected = true; // Andrea: Set isConnected to true to break out of the loop
                    }
                    // Andrea: Non-dapp browsers...
                    else {
                        alert('Please install MetaMask or use a dapp browser.');
                        break; // Andrea: Break out of the loop if MetaMask is not available
                    }

                    // Andrea: Wait for a short duration before the next iteration
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } finally {
                // Andrea: Ensure that setMetaMask is called even if the loop is broken
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