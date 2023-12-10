
import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import ConnectToMetaMask from "./metamask";
import { motion } from "framer-motion";
import { HelpModal } from "./helpmodal";
import JoinMarketplace from "./joinmarket";

function Start({ isconnected, setIsConnected, step1, setStep1 }) {
    const [metamask, setMetaMask] = useState(false);

    const fadeInVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <>
            {!isconnected && (
                <motion.div
                    style={{ color: 'white', marginBottom: '1rem', fontFamily: 'mephistoregular', fontSize: '3rem', zIndex: '1' }}
                    initial="hidden"
                    animate="visible"
                    variants={fadeInVariants}
                    transition={{ duration: 0.5 }}
                >
                    Connect to MetaMask
                </motion.div>
            )}
            {!isconnected &&
                <motion.div
                    style={{ display: "flex" }}
                    initial="hidden"
                    animate="visible"
                    variants={fadeInVariants}
                    transition={{ duration: 0.5 }}
                >
                    <Button mr={2} onClick={() => setMetaMask(true)}>Connect</Button>
                    <HelpModal />
                </motion.div>
            }
            {isconnected &&
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInVariants}
                    transition={{ duration: 0.5 }}
                    style={{ color: 'white', fontFamily: 'mephistoregular', fontSize: '3rem', zIndex: '1' }}>
                    Connected to MetaMask
                </motion.div>
            }
            {metamask && <ConnectToMetaMask setMetaMask={setMetaMask} setIsConnected={setIsConnected} setStep1={setStep1} />}
            {step1 && (
                <>
                <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInVariants}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{ color: 'white', fontFamily: 'mephistoregular', fontSize: '3rem', zIndex: '1' }}>
                <hr className="separator"></hr>
                Step 1<br/>Join the Market<br/>
                <JoinMarketplace />
                </motion.div>
                </>
            )}
        </>
    );
}

export default Start;
