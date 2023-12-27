import { useState } from "react";
import { Button, Text, Image, Box } from "@chakra-ui/react";
import { motion } from "framer-motion";

import ConnectToMetaMask from "./Metamask";
import HelpModal from "./HelpModal";
import Join from "./join";
import Market from "./market";
import Quests from "./quests";

import MarketLogo from '/img/marketlogo.png';
import QuestsLogo from '/img/questslogo.png';

//import GenerateButton from "../DEBUG/generate(DEBUG)";
//import AssignQuest from "../DEBUG/quest(DEBUG)";

export default function Start({ isConnected, setIsConnected, step1, setStep1, step2, setStep2 }) {
    const [metamask, setMetaMask] = useState(false);
    const [market, setMarket] = useState(false);
    const [quests, setQuests] = useState(false);

    const fadeInVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
    };

    const fadeOutVariants = {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 0, y: 50 }
    };

    const fadeInVariantsChoice = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: -50 }
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
                        style={{ color: 'white', fontFamily: 'mephistoregular', fontSize: '3rem', zIndex: '1', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                        <hr className="separator"></hr>
                        Join the Platform<br />
                        <Join setStep1={setStep1} setStep2={setStep2} />
                    </motion.div>
                </>
            )}
            {step2 && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInVariantsChoice}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="choice">

                        <Image src={MarketLogo} alt="Market" className={`main-logo market`} />

                        <Image src={QuestsLogo} alt="Market" className={`main-logo quests`} />              

                </motion.div>
            )}
            {step2 && market && !quests && <Market />}
            {step2 && !market && quests && <Quests />}
        </>
    );
}
