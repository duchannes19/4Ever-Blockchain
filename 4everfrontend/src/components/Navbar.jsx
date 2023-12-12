import { Flex, Spacer, Box, Heading, useColorMode, Button } from '@chakra-ui/react';

import Logo from '/img/logo(small).png';

export default function Navbar({ setIsConnected, setStep1 }) {

    const handleMetaMask = () => {
        localStorage.clear();
        setIsConnected(false);
        setStep1(false);
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
            <Box>
                <Button onClick={handleMetaMask} colorScheme="teal" variant="outline" size="sm" mr={4}>Reset</Button>
            </Box>
        </Flex>
    );
}
