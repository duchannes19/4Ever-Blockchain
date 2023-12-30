import { useState, useEffect } from "react";
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
    const [fadeDelay, setFadeDelay] = useState(false);
    const [fadeOutDelay, setFadeOutDelay] = useState(false);

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

    const handleForth = () => {
        setTimeout(() => {
            setFadeOutDelay(false);
            setFadeDelay(true);
        }, 400);
    };

    const handleBack = () => {
        setFadeOutDelay(true);
        setTimeout(() => {
            setFadeDelay(false);
            setMarket(false);
            setQuests(false);
        }, 400);
    }

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
                        style={{
                            color: 'white', fontFamily: 'mephistoregular', fontSize: '3rem', zIndex: '1', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                            height: (market || quests) ? '0' : '5em'
                        }}>
                        <hr className="separator"></hr>
                        Join the Platform<br />
                        <Join setStep1={setStep1} setStep2={setStep2} />
                    </motion.div>
                </>
            )}
            {(market || quests) && <Button className='backbutton' fontFamily={'mephistoregular'} zIndex={3} onClick={() => handleBack()}>Back</Button>}
            {step2 && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInVariantsChoice}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="choice"
                >

                    <Image src={MarketLogo} alt="Market"
                        onClick={() => { handleForth(); setMarket(true); setQuests(false); }}
                        className={`main-logo market ${market ? 'chosen' : ''}${quests ? 'notchosen' : ''} ${fadeDelay ? 'reposition' : ''}`} />
                    <Image src={QuestsLogo} alt="Quests"
                        onClick={() => { handleForth(); setQuests(true); setMarket(false); }}
                        className={`main-logo quests ${quests ? 'chosen' : ''}${market ? 'notchosen' : ''} ${fadeDelay ? 'reposition' : ''}`} />
                </motion.div>
            )}
            {step2 && market && !quests && fadeDelay &&
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeOutDelay ? fadeOutVariants : fadeInVariants}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <Market />
                </motion.div>
            }
            {step2 && !market && quests && fadeDelay &&
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeOutDelay ? fadeOutVariants : fadeInVariants}
                    transition={{ delay: fadeOutDelay ? 0 : 0.4, duration: 0.5 }}
                >
                    <Quests />
                </motion.div>
            }
        </>
    );
}
