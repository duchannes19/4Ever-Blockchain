import React from 'react';
import axios from 'axios';

import { useState, useEffect } from "react";
import { Box, Text, Image } from "@chakra-ui/react";

// Andrea: To complete with api requests and stuff 

const Quests = () => {
    const [quests, setQuests] = useState([]);

    /* Andrea: This is to be replaced by an api request to actually get the quests
    useEffect(() => {
        const getQuests = async () => {
            // Andrea: To Do: Actually gets a list of quests from the backend
            const quests = await axios.get('http://localhost:3001/quests');
            setQuests(quests.data);
            console.log(quests);
        };
        getQuests();
    }, []);
    */

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
                {Array.from({ length: 3 }).map((_, index) => (
                    <Image key={index} src='/img/questslogo.png' className='quest' marginBottom='2rem' />
                ))}
            </Box>
        </Box>
    );
};

export default Quests;
