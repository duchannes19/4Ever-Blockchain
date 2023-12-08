import React from 'react';
import { motion } from 'framer-motion';
import { Box, Image } from '@chakra-ui/react';
import Right from '../assets/sorcerer.png'
import Left from '../assets/knight.png'

const SideFigures = () => {
    return (
        <Box className="side-figures">
            <motion.div
                initial={{ x: -1000 }}
                animate={{ x: 0 }}
                transition={{ duration: 1 }}
                className="left-figure"
            >
                <Image src={Left} alt="Left Image" className="figure-image left" />
            </motion.div>
            <motion.div
                initial={{ x: 1000 }}
                animate={{ x: 0 }}
                transition={{ duration: 1 }}
                className="right-figure"
            >
                <Image src={Right} alt="Right Image" className="figure-image right" />
            </motion.div>
        </Box>
    );
};

export default SideFigures;
