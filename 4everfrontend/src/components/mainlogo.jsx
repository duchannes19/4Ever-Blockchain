import React from 'react';
import { Box, Image } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Logo from '../assets/Logo.png';

const MainLogo = () => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" bg='#242424'>
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Image src={Logo} alt="App Logo" className='main-logo'/>
            </motion.div>
        </Box>
    );
};

export default MainLogo;
