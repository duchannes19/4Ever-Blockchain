import { useEffect } from 'react';
import Web3 from 'web3';
import { Box } from '@chakra-ui/react';

const MetaMaskHelper = ({ setIsConnected, setStep1, setUseMetaMaskHelper, setMetaMask }) => {
    useEffect(() => {
        let isMounted = true;

        const connectToMetaMask = async () => {
            try {
                let isConnected = false;

                while (!isConnected && isMounted) {
                    if (window.ethereum) {
                        try {
                            await window.ethereum.request({ method: 'eth_requestAccounts' });
                            const web3 = new Web3(window.ethereum);

                            const accounts = await window.ethereum.request({
                                method: 'eth_accounts',
                            });

                            const balance = await web3.eth.getBalance(accounts[0]);

                            localStorage.setItem('connected', true);
                            localStorage.setItem('accounts', accounts[0]);
                            localStorage.setItem('balance', balance);

                            document.body.style.height = 'auto';

                            setIsConnected(true);
                            setStep1(true);
                            setMetaMask(false);

                            isConnected = true;
                        } catch (error) {
                            console.error('Error connecting to MetaMask:', error.message);
                            localStorage.clear();
                            window.location.reload();
                        }
                    } else if (window.web3) {
                        const web3 = new Web3(window.web3.currentProvider);
                        console.log('Connected to MetaMask (legacy):', web3);

                        isConnected = true;
                    } else {
                        alert('Please install MetaMask or use a dapp browser.');
                        break;
                    }

                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            catch (error) {
                localStorage.clear();
                window.location.reload();
            }
            finally {
                if (isMounted) {
                    setMetaMask(false);
                }
                setUseMetaMaskHelper(false);
            }
        };

        connectToMetaMask();

        return () => {
            isMounted = false;
        };
    }, [setIsConnected, setStep1, setMetaMask]);

    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            width="100vw"
            height="100vh"
            backgroundColor="rgba(0, 0, 0, 0.5)"
            backdropFilter="blur(10px)"
            zIndex={9999}
        />
    );
};

export default MetaMaskHelper;
