import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { motion } from "framer-motion";

import ConnectToMetaMask from "./Metamask";
import HelpModal from "./HelpModal";
import JoinMarketplace from "./JoinMarket";

export default function Start({ isConnected, setIsConnected, step1, setStep1, step2, setStep2 }) {
    const [metamask, setMetaMask] = useState(false);

    const fadeInVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
    };

    const fadeOutVariants = {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 0, y: 50 }
    };

    return (
        <>
            {!isConnected && (
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
            {!isConnected &&
                <motion.div
                    style={{ display: "flex" }}
                    initial="hidden"
                    animate="visible"
                    variants={fadeInVariants}
                    transition={{ duration: 0.5 }}
                >
                    <Button fontFamily={'mephistoregular'} mr={2} onClick={() => setMetaMask(true)}>Connect</Button>
                    <HelpModal />
                </motion.div>
            }
            {isConnected && !step2 &&
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={step2 ? fadeOutVariants : fadeInVariants}
                    transition={{ duration: 0.5 }}
                    style={{ color: 'white', fontFamily: 'mephistoregular', fontSize: '3rem', zIndex: '1', pointerEvents: 'none' }}>
                    Connected to MetaMask
                </motion.div>
            }
            {metamask && <ConnectToMetaMask setMetaMask={setMetaMask} setIsConnected={setIsConnected} setStep1={setStep1} />}
            {step1 && (
                <>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={step2 ? fadeOutVariants : fadeInVariants}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        style={{ color: 'white', fontFamily: 'mephistoregular', fontSize: '3rem', zIndex: '1' }}>
                        <hr className="separator"></hr>
                        Step 1<br />Join the Market<br />
                        <JoinMarketplace setStep1={setStep1} setStep2={setStep2} />
                    </motion.div>
                </>
            )}
            {step2 && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInVariants}
                    transition={{ delay: 1, duration: 0.5 }}
                    // Andrea: the height is temporary, it's just to show the whole background
                    style={{ color: 'white', fontFamily: 'mephistoregular', fontSize: '3rem', zIndex: '1', height: '25rem', filter: 'drop-shadow(0px 0px 10px black)'}}>
                    Choose<br />
                    <Button fontFamily={'mephistoregular'} mr={2} /*TODO Next Action*/>Create NFT</Button>
                    <Button fontFamily={'mephistoregular'} mr={2} /*TODO Next Action*/>Buy</Button>
                    <Button fontFamily={'mephistoregular'} mr={2} /*TODO Next Action*/>Sell</Button>
                </motion.div>
            )}
        </>
    );
}
