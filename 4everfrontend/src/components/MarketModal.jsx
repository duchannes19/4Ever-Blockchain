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
    Text
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

import MerchIcon from '/img/merchant-icon.png';

// Andrea: NB! Items images are placeholders for now, it should be replaced by the URL of the actual NFTs

export default function ContentModal({ isOpen, onClose, type, selectedMerchant }) {

    const [switchToDescription, setSwitch] = useState(false);
    const [delay, setDelay] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});

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
    }

    const handleBack = () => {
        setDelay(false);
        setTimeout(() => {
            setSwitch(false);
            setSelectedItem({});
        }, 500);
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size='full'>
                <ModalOverlay />
                {type === 'merchant' && (
                    <ModalContent bg={colorMode === 'dark' ? 'gray.800' : 'white'} color={colorMode === 'dark' ? 'white' : 'black'} margin={'1rem'} >
                        <ModalHeader textAlign={'center'} fontFamily='mephistoregular' fontSize='3rem'>
                            {switchToDescription ? selectedItem.name : 'Merchant'}
                        </ModalHeader>
                        <ModalCloseButton />
                        <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                        <ModalBody margin={'0.5rem'} >
                            {!switchToDescription && (
                                <motion.div className='merchantmodal' initial='hidden' animate='visible' variants={delay ? fadeOutVariants : fadeInVariants} transition={{ duration: 0.5 }}>
                                    <Image src={MerchIcon} alt='merchant icon' className='merchant icon' />
                                    <Box bg='#333232' style={{ borderRadius: '10px' }}>
                                        <Text fontFamily='mephistoregular' fontSize='2.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>Items</Text>
                                        <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                                        <Box className='merchant items'>
                                            {selectedMerchant.items.map((item, index) => (
                                                <Image key={index} src={MerchIcon} className='merchant item' onClick={() => { handleItem(item) }} />
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
                                        <Image src={MerchIcon} alt='item icon' className='item icon' />
                                        <Box bg='#333232' style={{ borderRadius: '10px' }}>
                                            <Text fontFamily='mephistoregular' fontSize='2.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>Description</Text>
                                            <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                                            <Box className='merchant description'>
                                                <Text fontFamily='mephistoregular' fontSize='1.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>{selectedItem.description}</Text>
                                            </Box>
                                            <Text fontFamily='mephistoregular' fontSize='2.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>Price: {selectedItem.price}</Text>
                                        </Box>
                                    </Box>
                                </motion.div>
                            )}

                        </ModalBody>

                        <ModalFooter>
                            {switchToDescription && <Button fontFamily={'mephistoregular'} mr={2}>Buy</Button>}
                            <Button colorScheme='gray' mr={3} onClick={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                )}
            </Modal>
        </>
    );
}