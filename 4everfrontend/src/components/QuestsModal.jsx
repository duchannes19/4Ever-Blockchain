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

import QuestsLogo from '/img/quest.png';

export default function QuestsModal({ isOpen, onClose, selectedQuest }) {

    const colorMode = 'dark';

    const fadeInVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 }
    };

    // Andrea: To Do -> Actually submit the quest to the backend

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size='full'>
                <ModalOverlay />
                <ModalContent bg={colorMode === 'dark' ? 'gray.800' : 'white'} color={colorMode === 'dark' ? 'white' : 'black'} margin={'1rem'} >
                    <ModalHeader textAlign={'center'} fontFamily='mephistoregular' fontSize='3rem'>
                        {selectedQuest.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                    <ModalBody margin={'0.5rem'} alignItems='center' display='flex' justifyContent='center'>

                        <motion.div className='merchantmodal' initial='hidden' animate='visible' variants={fadeInVariants} transition={{ duration: 0.5 }}>
                            <Image src={QuestsLogo} alt='merchant icon' className='merchant icon' />
                            <Box bg='#333232' style={{ borderRadius: '10px' }}>
                                <Box className='merchant items'>
                                    <Box bg='#333232' style={{ borderRadius: '10px' }}>
                                        <Text fontFamily='mephistoregular' fontSize='2.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>Description</Text>
                                        <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                                        <Box className='merchant description'>
                                            <Text fontFamily='mephistoregular' fontSize='1.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>{selectedQuest.description}</Text>
                                        </Box>
                                        <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                                        <Text fontFamily='mephistoregular' fontSize='2.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>Partecipants: {selectedQuest.participants.length}</Text>
                                        <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                                        <Text fontFamily='mephistoregular' fontSize='2.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>Starts: *To Implement*</Text>
                                        <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                                        <Text fontFamily='mephistoregular' fontSize='2.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>Expires: {selectedQuest.expirationDate}</Text>
                                    </Box>

                                </Box>
                            </Box>
                        </motion.div>

                    </ModalBody>

                    <ModalFooter>
                        <Button fontFamily={'mephistoregular'} colorScheme='green' mr={3} onClick={onClose}>
                            Partecipate
                        </Button>
                        <Button fontFamily={'mephistoregular'} colorScheme='gray' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>

            </Modal>
        </>
    );
}