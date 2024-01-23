import React, { useState } from 'react';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Image,
    Box,
    Text,
    Alert,
    AlertIcon
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

import axios from 'axios';
import Web3 from 'web3';

import Notify from './Notify';
import MerchIcon from '/img/merchant-icon.png';

export default function MarketModal({ isOpen, onClose, selectedMerchant, setSelectedMerchant, setItems }) {

    const [switchToDescription, setSwitch] = useState(false);
    const [delay, setDelay] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const isDisabled = selectedMerchant.address === localStorage.getItem('accounts');

    const colorMode = 'dark';

    const fadeInVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 }
    };

    const fadeInVariants2 = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 }
    };

    const fadeOutVariants = {
        hidden: { opacity: 1, x: 0 },
        visible: { opacity: 0, x: -50 }
    };

    const fadeOutVariants2 = {
        hidden: { opacity: 1, x: 0 },
        visible: { opacity: 0, x: 50 }
    };

    const handleItem = (item) => {
        setDelay(true);
        setSelectedItem(item);
        setTimeout(() => {
            setSwitch(true);
        }, 500);
    };

    const handleBack = () => {
        setDelay(false);
        setTimeout(() => {
            setSwitch(false);
            setSelectedItem({});
        }, 500);
    };

    const handleOnClose = () => {
        setDelay(false);
        setSwitch(false);
        setSelectedItem({});
        onClose();
    };

    const handleBuy = async () => {
        const web3 = new Web3(window.ethereum);
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/api/buy-nft', {
                buyerAddress: localStorage.getItem('accounts'),
                tokenId: selectedItem.id
            });
            if (response.data.success) {
                console.log(response.data.message);
                Notify('success', 'You have bought the NFT!');
                setItems(response.data.merchants);
                // Andrea: Update the selected merchant items
                setSelectedMerchant(response.data.merchants.find(merchant => merchant.address === selectedMerchant.address));
                handleBack();
                // Andrea: Update local storage balance in eth
                setTimeout(async () => {
                    console.log('Updating balance');
                    const balance = await web3.eth.getBalance(localStorage.getItem('accounts'));
                    const balanceInEther = web3.utils.fromWei(balance, 'ether');
                    localStorage.setItem('balance', balanceInEther);
                }, 5000);
            }
            else {
                console.log(response.data.message);
                Notify('error', response.data.message);
            }
        } catch (error) {
            console.error(error);
            Notify('error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size='full'>
                <ModalOverlay />

                <ModalContent bg={colorMode === 'dark' ? 'gray.800' : 'white'} color={colorMode === 'dark' ? 'white' : 'black'} margin={'1rem'} >
                    <ModalHeader textAlign={'center'} fontFamily='mephistoregular' fontSize='3rem' className='merchant name'>
                        {switchToDescription ? selectedItem.name : (
                            <>
                                Merchant
                                <br />
                                <Text fontFamily='mephistoregular' fontSize='1.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>
                                    {selectedMerchant.address}
                                </Text>
                            </>
                        )}
                    </ModalHeader>
                    <ModalCloseButton />
                    <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                    <ModalBody margin={'0.5rem'} alignItems='center' display='flex' justifyContent='center'>
                        {!switchToDescription && (
                            <motion.div className='merchantmodal' initial='hidden' animate='visible' variants={delay ? fadeOutVariants : fadeInVariants} transition={{ duration: 0.5 }}>
                                <Image src={MerchIcon} alt='merchant icon' className='merchant icon' />
                                <Box bg='#333232' style={{ borderRadius: '10px' }} className='merchantitemscontainer'>
                                    <Text fontFamily='mephistoregular' fontSize='2.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>Items</Text>
                                    <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                                    <Box className='merchant items'>
                                        {selectedMerchant.items.map((item, index) => (
                                            <Image key={index} src={'http://localhost:3000/' + item.image} className='merchant item' onClick={() => { handleItem(item) }} />
                                        ))}
                                    </Box>
                                </Box>
                            </motion.div>
                        )}


                        {switchToDescription && (
                            <motion.div initial='hidden' animate='visible' variants={delay ? fadeInVariants2 : fadeOutVariants2} transition={{ duration: 0.5 }}>
                                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginBottom: '2rem' }}>
                                    <Button fontFamily={'mephistoregular'} mr={2} onClick={handleBack}>Back</Button>
                                </Box>
                                <Box className='merchantmodal'>
                                    <Image src={'http://localhost:3000/' + selectedItem.image} alt='item icon' className='item icon' />
                                    <Box bg='#333232' style={{ borderRadius: '10px' }} className='item descriptions'>
                                        <Text fontFamily='mephistoregular' fontSize='2.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>Description</Text>
                                        <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                                        <Box className='merchant description'>
                                            <Text fontFamily='mephistoregular' fontSize='1.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>{selectedItem.description}</Text>
                                        </Box>
                                        <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                                        <Text fontFamily='mephistoregular' fontSize='2.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>Rarity</Text>
                                        <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                                        <Text fontFamily='mephistoregular' fontSize='1.5rem' padding='1rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>
                                            {selectedItem.rarity}
                                        </Text>
                                    </Box>
                                </Box>
                                <Alert status='warning' justifyContent={'center'} padding={'0'} borderRadius={'10px'} marginTop={'1rem'}>
                                    <AlertIcon />
                                    <Text fontFamily='mephistoregular' fontSize='1rem' color='black' marginBottom='2rem' marginTop='2rem' textAlign='center'>The cost is fixed and is 2 ETH.</Text>
                                </Alert>
                            </motion.div>
                        )}

                    </ModalBody>

                    <ModalFooter>
                        {switchToDescription && (
                            <Button
                                fontFamily={'mephistoregular'}
                                colorScheme='green'
                                mr={2}
                                disabled={isDisabled}
                                style={{ pointerEvents: isDisabled ? 'none' : 'auto', opacity: isDisabled ? 0.5 : 1 }}
                                onClick={handleBuy}
                                isLoading={isLoading}
                            >
                                Buy
                            </Button>
                        )}
                        <Button colorScheme='gray' mr={3} onClick={handleOnClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>

            </Modal>
        </>
    );
}