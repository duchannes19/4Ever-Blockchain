import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { motion } from "framer-motion";

import ConnectToMetaMask from "./Metamask";
import HelpModal from "./HelpModal";
import JoinMarketplace from "./JoinMarket";
import GenerateButton from "./generate(test)";
import AssignQuest from "./quest";

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
                    <Button fontFamily={'mephistoregular'} mr={2} onClick={() => setMetaMask(true)} disabled={metamask}>Connect</Button>
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
            {step1 && !step2 && (
                <>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={step2 ? fadeOutVariants : fadeInVariants}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        style={{ color: 'white', fontFamily: 'mephistoregular', fontSize: '3rem', zIndex: '1' }}>
                        <hr className="separator"></hr>
                        Join the Market<br />
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
                    className="choice">
                    Choose<br />
                    {/* Andrea: Maybe convert the buttons directly to components?*/}
                    <AssignQuest />
                    <Button fontFamily={'mephistoregular'} mr={2} /*TODO Next Action*/>Buy</Button>
                    <Button fontFamily={'mephistoregular'} mr={2} /*TODO Next Action*/>Sell</Button>
                    <GenerateButton />
                </motion.div>
            )}
        </>
    );
}
