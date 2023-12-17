import React, { useEffect } from 'react';
import { Box, Image } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import Logo from '/img/Logo.png';
import Logo2 from '/img/logo2.png';
import MarketLogo from '/img/marketlogo.png';
import MarketBackground from '/img/market-background.png';

export default function MainLogo({ resize }) {

    useEffect(() => {
        if (resize) {
            //Set background to image with fade in
            document.body.style.transition = "background-image 2s ease-in-out";
            document.body.style.backgroundImage = `url(${MarketBackground})`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundRepeat = "no-repeat";
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.opacity = "1";
        }
    }, [resize]);

    return (
        <Box display="flex" justifyContent="center" alignItems="center" bg='transparent'>
            <motion.div className='logo-container' initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Image src={Logo} alt="App Logo" className={`main-logo first ${resize ? 'resize' : ''}`} />
                <Image src={Logo2} alt="App Logo" className={`main-logo second ${resize ? 'resize' : ''}`} />
                {resize && <Image src={MarketLogo} alt="App Logo" className={`main-logo third`} />}
            </motion.div>
        </Box>
    );
}
