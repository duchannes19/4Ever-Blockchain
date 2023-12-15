import { motion } from 'framer-motion';
import { Box, Image } from '@chakra-ui/react';

import Right from '/img/sorcerer.png';
import Left from '/img/knight.png';

export default function SideFigures({ fadeout }) {
    return (
        <Box className="side-figures">
            <motion.div
                initial={{ opacity: fadeout ? 0 : 1 }}
                animate={{ opacity: fadeout ? 0 : 1 }}
                transition={{ duration: fadeout ? 0.2 : 2 }}
                className="left-figure"
            >
                <Image src={Left} alt="Left Image" className="figure-image left" />
            </motion.div>
            <motion.div
                initial={{ opacity: fadeout ? 0 : 1 }}
                animate={{ opacity: fadeout ? 0 : 1 }}
                transition={{ duration: fadeout ? 0.2 : 2 }}
                className="right-figure"
            >
                <Image src={Right} alt="Right Image" className="figure-image right" />
            </motion.div>
        </Box>
    );
}
