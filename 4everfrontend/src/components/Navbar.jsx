import React from 'react';
import User from './user';

import { Flex, Spacer, Box, Heading, Button } from '@chakra-ui/react';

import Logo from '/img/logo(small).png';

export default function Navbar({ setIsConnected, setStep1, setStep2, isJoined }) {

    const handleMetaMask = () => {
        localStorage.clear();
        setIsConnected(false);
        setStep1(false);
        setStep2(false);
        document.body.style.backgroundImage = 'url("/img/mainback.png")';
        document.body.style.height = "100vh";
    };

    return (
        <Flex p={4} bg="#191410" align="center" position="absolute" top={0} left={0} right={0} boxShadow="0px 2px 4px rgba(0, 0, 0, 0.25)">
            <Box p="2" display={'flex'} alignItems={'center'} gap={'0.1rem'}>
                <img src={Logo} alt="Logo" className='logo' />
                <Heading as="h1" size="md" color="white" fontFamily={'mephistoregular'} fontSize={'2rem'}>
                    EVER
                </Heading>
            </Box>
            <Spacer />
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {!isJoined && <Button colorScheme="teal" variant="outline" mr={3} onClick={handleMetaMask}>
                    Reset
                </Button>}
                {isJoined && <User reset={handleMetaMask} />}
            </Box>
        </Flex>
    );
}
