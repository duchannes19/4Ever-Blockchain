import React from 'react';
import axios from 'axios';

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
import { useState } from 'react';

import QuestsLogo from '/img/quest.png';

import Notify from './Notify';

export default function QuestsModal({ isOpen, onClose, selectedQuest }) {

    const colorMode = 'dark';
    const address = localStorage.getItem('accounts');
    const isDisabled = selectedQuest.quest.participants.includes(address);
    const cantUnjoin = selectedQuest.quest.startDate < Date.now();
    const haswinner = selectedQuest.quest.winner;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const fadeInVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 }
    };


    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:3000/api/join-quest', {
                userAddress: address,
                questName: selectedQuest.quest.name
            });
            if (response.data.success) {
                console.log(response.data.message);
                //Notify('success', 'You have joined the quest!');
            }
            else {
                console.log(response.data.message);
                Notify('error', response.data.message);
            }
        } catch (error) {
            console.error(error);
            Notify('error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUnjoin = async () => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:3000/api/unjoin-quest', {
                userAddress: address,
                questName: selectedQuest.quest.name
            });
            if (response.data.success) {
                console.log(response.data.message);
                //Notify('success', 'You have unjoined the quest!');
            }
            else {
                console.log(response.data.message);
                Notify('error', response.data.message);
            }
        } catch (error) {
            console.error(error);
            Notify('error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVictory = async () => {
        // Simulate a call to the backend that set the winner of the quest
        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:3000/api/simulate-victory', {
                userAddress: address,
                questName: selectedQuest.quest.name
            });
            if (response.data.success) {
                console.log(response.data.message);
                Notify('success', response.data.message);
            }
            else {
                console.log(response.data.message);
                Notify('error', response.data.message);
            }
        } catch (error) {
            console.error(error);
            Notify('error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size='full'>
                <ModalOverlay />
                <ModalContent bg={colorMode === 'dark' ? 'gray.800' : 'white'} color={colorMode === 'dark' ? 'white' : 'black'} margin={'1rem'} >
                    <ModalHeader textAlign={'center'} fontFamily='mephistoregular' fontSize='3rem'>
                        {selectedQuest.quest.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                    <ModalBody margin={'0.5rem'} alignItems='center' display='flex' justifyContent='center'>

                        <motion.div className='merchantmodal' initial='hidden' animate='visible' variants={fadeInVariants} transition={{ duration: 0.5 }}>
                            <Image src={QuestsLogo} alt='merchant icon' className='merchant icon' />
                            <Box bg='#333232' style={{ borderRadius: '10px' }}>
                                <Box className='merchant items' style={{ maxHeight: '80%' }}>
                                    <Box bg='#333232' style={{ borderRadius: '10px' }}>
                                        <Text fontFamily='mephistoregular' fontSize='2.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>Issued By</Text>
                                        <Image src={'/img/'+selectedQuest.quest.sponsor+'.png'} alt='sponsor icon' className='sponsor icon' />
                                        <hr style={{ margin: 'auto', marginTop:'2rem', marginBottom: '1rem', width: '80%' }} />
                                        <Text fontFamily='mephistoregular' fontSize='2.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>Description</Text>
                                        <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                                        <Box className='merchant description'>
                                            <Text fontFamily='mephistoregular' fontSize='1.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>{selectedQuest.quest.description}</Text>
                                        </Box>
                                        <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                                        <Text fontFamily='mephistoregular' fontSize='2.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>Partecipants: {selectedQuest.quest.participants.length}</Text>
                                        <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                                        {((haswinner === localStorage.getItem('accounts')) && selectedQuest.quest.questEnded) ?

                                            <Text fontFamily='mephistoregular' fontSize='2.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'> You won this quest<br />Congratulation!</Text>
                                            :
                                            <>
                                                <Text fontFamily='mephistoregular' fontSize='2.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>Starts: {selectedQuest.quest.startDate}</Text>
                                                <hr style={{ margin: 'auto', marginBottom: '1rem', width: '80%' }} />
                                                <Text fontFamily='mephistoregular' fontSize='2.5rem' color='white' marginBottom='2rem' marginTop='2rem' textAlign='center'>Expires: {selectedQuest.quest.expirationDate}</Text>
                                            </>
                                        }
                                    </Box>

                                </Box>
                            </Box>
                        </motion.div>

                    </ModalBody>

                    <ModalFooter className='quest-footer'>
                        {/*(haswinner === localStorage.getItem('accounts')) && <Button fontFamily={'mephistoregular'} colorScheme='green' mr={3} onClick={handleSubmit} isLoading={isSubmitting}> Claim Reward </Button>*/}
                        <Button fontFamily={'mephistoregular'} colorScheme='purple' mr={3} onClick={handleVictory} isLoading={isSubmitting} isDisabled={!isDisabled || (haswinner === localStorage.getItem('accounts'))}> Simulate Victory </Button>
                        <Button fontFamily={'mephistoregular'} colorScheme='green' mr={3} onClick={handleSubmit} isLoading={isSubmitting} isDisabled={isDisabled}>
                            Partecipate
                        </Button>
                        {isDisabled && <Button fontFamily={'mephistoregular'} colorScheme='red' mr={3} onClick={handleUnjoin} isLoading={isSubmitting} isDisabled={cantUnjoin || (haswinner === localStorage.getItem('accounts'))}> Unjoin </Button>}
                        <Button fontFamily={'mephistoregular'} colorScheme='gray' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>

            </Modal>
        </>
    );
}