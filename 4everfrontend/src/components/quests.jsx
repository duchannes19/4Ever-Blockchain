import React from 'react';
import axios from 'axios';

import { useState, useEffect } from "react";
import { Box, Text, Image, useDisclosure } from "@chakra-ui/react";

import QuestsModal from './QuestsModal';

import DEBUG_QUESTS from '../DEBUG/quests(DEBUG).json';
// Andrea: To complete with api requests and stuff 

const Quests = () => {
    const [quests, setQuests] = useState([]);
    const [selectedQuest, setSelectedQuest] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    /* Andrea: This is to be replaced by an api request to actually get the quests */
    useEffect(() => {
        const getQuests = async () => {
            // Andrea: To Do: Actually gets a list of quests from the backend
            try {
                const quests = await axios.get('http://localhost:3001/getMerchants');
                setItems(quests.data);
                console.log(quests.message);
            }
            catch (error) {
                console.error(error);
            }
        };

        //getQuests();

        // Andrea: DEBUG, load some quests from a local json file
        setQuests(DEBUG_QUESTS.quests);
    }, []);

    const handleModal = (quest) => {
        setSelectedQuest(quest);
        onOpen();
    }

    return (
        <Box className='quests-box'>
            <Text fontFamily='mephistoregular' fontSize='3rem' color='white' paddingTop='1rem'>
                Welcome to the Board
            </Text>
            <hr style={{ margin: 'auto', marginBottom: '2rem', width: '80%' }} />
            <Text fontFamily='mephistoregular' fontSize='1.5rem' color='white' marginBottom='2rem'>
                Here you can find the quests that are available for you to participate in
            </Text>
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                flexWrap='wrap'
                gap='1rem'
                marginBottom='2rem'
            >
                {/* Andrea: These are just placeholders */}
                {quests.map((quest, index) => (
                    <Image key={index} src='/img/quest.png' className='quest' marginBottom='2rem' onClick={() => { handleModal(quest) }} />
                ))}
            </Box>
            {selectedQuest && <QuestsModal isOpen={isOpen} onClose={onClose} selectedQuest={selectedQuest} />}
        </Box>
    );
};

export default Quests;
