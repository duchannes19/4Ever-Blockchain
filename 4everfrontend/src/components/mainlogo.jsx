import React, { useEffect } from 'react';
import { Box, Image } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import Logo from '/img/Logo.png';
import Logo2 from '/img/logo2.png';
import ChoiceBackground from '/img/choice-background.png';

export default function MainLogo({ resize }) {

    useEffect(() => {
        if (resize) {
            document.body.style.setProperty('background-image', `url(${ChoiceBackground})`, 'important');
        }
    }, [resize]);

    return (
        <Box display="flex" justifyContent="center" alignItems="center" bg='transparent'>
            <motion.div className='logo-container' initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Image src={Logo} alt="App Logo" className={`main-logo first ${resize ? 'resize' : ''}`} />
                <Image src={Logo2} alt="App Logo" className={`main-logo second ${resize ? 'resize' : ''}`} />
            </motion.div>
        </Box>
    );
}
