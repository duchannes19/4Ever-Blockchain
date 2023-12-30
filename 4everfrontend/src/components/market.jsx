import React from 'react'

import { Box, Text, Image } from "@chakra-ui/react";

// To Do

export default function Market() {
    return (
        <Box className='quests-box'>
        <Text fontFamily='mephistoregular' fontSize='3rem' color='white' paddingTop='1rem'>
            Welcome to the Market
        </Text>
        <hr style={{ margin: 'auto', marginBottom: '2rem', width: '80%' }} />
        <Text fontFamily='mephistoregular' fontSize='1.5rem' color='white' marginBottom='2rem'>
            Buy and sell your NFTs here
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
    )
};