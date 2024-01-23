import { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { toChecksumAddress } from 'web3-utils';
import { TypeAnimation } from 'react-type-animation';

import Web3 from 'web3';

export default function ConnectToMetaMask({ setMetaMask, setIsConnected, setStep1, setMetaMask2, option }) {

    useEffect(() => {
        const connectToMetaMask = async () => {
            try {
                let isConnected = false;

                // Andrea: Keep looping until the user connects or cancels
                while (!isConnected) {
                    // Andrea: Modern dapp browsers...
                    if (window.ethereum) {
                        try {
                            const web3 = new Web3(window.ethereum);

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
                            if (option === 0) {
                                setMetaMask(false);
                                setStep1(true);
                            }
                            else {
                                setMetaMask2(false);
                            }

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

    return (
        <Box className='metamask'
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="transparent"
            backdropFilter="blur(10px)"
            zIndex={9999}
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <Box className='metamask__content'>
                <TypeAnimation
                    sequence={[
                        // Same substring at the start will only be typed out once, initially
                        'Awaiting',
                        1000, // wait 1s before replacing "Mice" with "Hamsters"
                        'Awaiting.',
                        1000,
                        'Awaiting..',
                        1000,
                        'Awaiting...',
                        1000,
                        'Awaiting..',
                        1000,
                        'Awaiting.',
                        1000,
                        'Awaiting'
                    ]}
                    wrapper="span"
                    speed={50}
                    cursor={false}
                    repeat={Infinity}
                    style={{ fontSize: '1.5em', display: 'inline-block', color: 'white', fontFamily: 'mephistoregular' }}
                />
                {option === 0 &&
                    <Text className='metamask__content__subtitle'>
                        Please make sure you have MetaMask installed.
                    </Text>
                }
                <Text className='metamask__content__subtitle'>
                    If you have MetaMask installed, please make sure it is unlocked.
                </Text>
                <Text className='metamask__content__subtitle'>
                    If it looks stuck, please refresh the page.
                </Text>
            </Box>
        </Box>
    );
}