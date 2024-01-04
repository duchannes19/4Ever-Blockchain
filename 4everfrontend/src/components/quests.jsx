import React, { useState, useEffect } from 'react';
import axios from 'axios';

import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Box, Text, Image, useDisclosure } from "@chakra-ui/react";

import QuestsModal from './QuestsModal';
import Notify from './Notify';

const Quests = () => {
    const [quests, setQuests] = useState([]);
    const [selectedQuest, setSelectedQuest] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const socketUrl = 'ws://localhost:3000'; 

    const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
        onMessage: (event) => {
            const data = JSON.parse(event.data);
            setQuests(data.quests);
    
            if (selectedQuest) {
                const matchingQuest = data.quests.find((quest) => quest.name === selectedQuest.quest.name);
    
                if (matchingQuest) {
                    setSelectedQuest({ quest: matchingQuest, index: selectedQuest.index });
                }
            }
        },
        onError: (event) => {
            console.error(event);
            Notify('error', 'WebSocket connection error');
        },
    });
    

    useEffect(() => {
        const getQuests = async () => {
            try {
                const quests = await axios.get('http://localhost:3000/api/get-quests');
                if (quests.data.success) {
                    setQuests(quests.data.quests);
                    if (selectedQuest) {
                        const quest = quests.data.quests[selectedQuest.index];
                        setSelectedQuest({ quest, index: selectedQuest.index });
                    }
                }
                else {
                    console.log(quests.data.message);
                    Notify('error', quests.data.message);
                }
            }
            catch (error) {
                console.error(error);
                Notify('error', error.message);
            }
        };

        getQuests();

    }, []);

    const handleModal = (quest, index) => {
        setSelectedQuest({ quest, index });
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
                {quests.map((quest, index) => (
                    <Image key={index} src='/img/quest.png' className='quest' marginBottom='2rem' onClick={() => { handleModal(quest, index) }} />
                ))}
            </Box>
            {selectedQuest && <QuestsModal isOpen={isOpen} onClose={onClose} selectedQuest={selectedQuest} setSelectedQuest={setSelectedQuest} setQuests={setQuests} />}
        </Box>
    );
};

export default Quests;
