import React from 'react';
import axios from 'axios';

import { useState, useEffect } from "react";
import { Box, Text, Image, useDisclosure } from "@chakra-ui/react";

import QuestsModal from './QuestsModal';

import Notify from './Notify';

const Quests = () => {
    const [quests, setQuests] = useState([]);
    const [selectedQuest, setSelectedQuest] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

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

    //Andrea: Add Loop to keep the quests log updated (maybe use sockets instead?)
    useEffect(() => {
        const interval = setInterval(() => {
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
        }, 10000);
        return () => clearInterval(interval);
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
