import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { motion } from 'framer-motion';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Image, Box, Button, Text } from "@chakra-ui/react";

import Notify from './Notify';

const MyNFTs = ({ isOpen, onClose }) => {

    const account = localStorage.getItem('accounts');
    const colorMode = 'dark';

    const [NFTs, setNFTs] = useState(null);
    const [showNFT, setShowNFT] = useState(false);
    const [selectedNFT, setSelectedNFT] = useState({});

    // Andrea: To do: Add axios call to get user's NFTs from the backend
    useEffect(() => {
        if (account) {
            const getNFTs = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/api/get-nfts/?address=${account}`);
                    if (response.data.success) {
                        setNFTs(response.data.nfts);
                        console.log(response.data.message);
                    }
                    else {
                        console.log(response.data.message);
                    }
                } catch (error) {
                    console.error(error);
                    Notify('error', 'Failed to load NFTs');
                }
            };
            getNFTs();
        }
    }, [account]);

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
        visible: { opacity: 0, x: -50, display: 'none' }
    };

    const fadeOutVariants2 = {
        hidden: { opacity: 1, x: 0 },
        visible: { opacity: 0, x: 50 }
    };

    const handleNFT = (nft) => {
        setSelectedNFT(nft);
        setShowNFT(true);
    }

    const handleBack = () => {
        setShowNFT(false);
        setSelectedNFT({});
    }

    const handleNFTSale = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/handle-nft', {
                address: selectedNFT.owner,
                tokenID: selectedNFT.id,
                status: selectedNFT.isForSale
            });
            if (response.data.success) {
                console.log(response.data.message);
                setNFTs(response.data.nfts);
                // Update selectedNFT.isForSale
                setSelectedNFT({ ...selectedNFT, isForSale: response.data.status });
                Notify('success', `NFT is now ${response.data.status ? '' : 'not '}on sale!`);
            } else {
                console.log(response.data.message);
                Notify('error', response.data.message);
            }
        } catch (error) {
            console.error(error);
            Notify('error', error.message);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size='full'>
            <ModalOverlay />
            <ModalContent bg={colorMode === 'dark' ? 'gray.800' : 'white'} color={colorMode === 'dark' ? 'white' : 'black'} margin={'7rem'} marginTop={'1rem !important'} borderRadius={'10px'} >
                <ModalHeader textAlign='center' fontFamily={'mephistoregular'} fontSize={'3rem'}>My NFTs</ModalHeader>
                <hr style={{ margin: 'auto', marginBottom: '2rem', width: '80%' }} />
                <ModalCloseButton zIndex='99999' />
                <ModalBody>
                    {/* Andrea: To do: Add NFTs here */}

                    {!NFTs &&
                        <Box display="flex" justifyContent="center" alignItems="center" position='absolute'
                            top='0' bottom='0' left='0' right='0'
                        >
                            <Text fontFamily='mephistoregular' fontSize='2rem' color='white' margin='auto' textAlign='center'>No NFTs Found</Text>
                        </Box>
                    }

                    <motion.div textAlign='center' mb='1rem' className='nfts-container' variants={showNFT ? fadeOutVariants : fadeInVariants} initial='hidden' animate='visible' exit='hidden'>
                        {NFTs && NFTs.map((nft, index) => {
                            return (
                                <Image key={index} src={'http://localhost:3000/' + nft.image} alt={nft.name} className='nft' onClick={() => { handleNFT(nft) }} />
                            );
                        })}
                    </motion.div>

                    {/* Andrea: To do: Add NFT description here */}
                    {/* Use the same approach as in MarketModal.jsx */}
                    {showNFT && (
                        <motion.div textAlign='center' mb='1rem' className='nft-container' variants={showNFT ? fadeInVariants2 : fadeOutVariants2} initial='hidden' animate='visible' exit='hidden'>
                            <Image src={'http://localhost:3000/' + selectedNFT.image} alt={selectedNFT.name} className='nft disabled' />
                            <Box bg='#333232' style={{ borderRadius: '10px' }}>
                                <Box className='nft description'>
                                    <Text fontFamily='mephistoregular' fontSize='2.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>{selectedNFT.name}</Text>
                                    <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                                    <Text fontFamily='mephistoregular' fontSize='1.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>Rarity: {selectedNFT.rarity}</Text>
                                    <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                                    <Text fontFamily='mephistoregular' fontSize='1.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>Owner: {selectedNFT.owner}</Text>
                                    <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                                    <Text fontFamily='mephistoregular' fontSize='1.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>Is Selling: {selectedNFT.isForSale ? 'Yes' : 'No'}</Text>
                                    <Box className='nft-buttons'>
                                        <Button fontFamily='mephistoregular' colorScheme='green' marginBottom='2rem' marginTop='2rem' textAlign='center' onClick={handleNFTSale}>
                                            {selectedNFT.isForSale ? 'Remove from Sale' : 'Sell'}
                                        </Button>
                                        <Button fontFamily='mephistoregular' colorScheme='gray' marginBottom='2rem' marginTop='2rem' textAlign='center' onClick={handleBack}>Back</Button>
                                    </Box>
                                </Box>
                            </Box>
                        </motion.div>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default MyNFTs;
