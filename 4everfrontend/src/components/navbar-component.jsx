// Navbar.js
import React from 'react';
import { Flex, Spacer, Box, Heading, useColorMode } from '@chakra-ui/react';
import Logo from '../assets/logo(small).png';



const Navbar = () => {

    return (
        <Flex p={4} bg="#191410" align="center" position="absolute" top={0} left={0} right={0} boxShadow="0px 2px 4px rgba(0, 0, 0, 0.25)">
            <Box p="2" display={'flex'} alignItems={'center'} gap={'0.1rem'}>
                <img src={Logo} alt="Logo" className='logo'/>
                <Heading as="h1" size="md" color="white" fontFamily={'mephistoregular'} fontSize={'2rem'}>
                    EVER
                </Heading>
            </Box>
            <Spacer />
            <Box>
                
            </Box>
        </Flex>
    );
};

export default Navbar;
