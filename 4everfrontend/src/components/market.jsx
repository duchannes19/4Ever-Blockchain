import React from 'react'
import axios from 'axios';

import { useState, useEffect } from "react";
import { Box, Text, Image, useDisclosure } from "@chakra-ui/react";

import MarketModal from './MarketModal';
import Icon from '/img/merchant-icon.png';

import DEBUG_MERCHANTS from '../DEBUG/merchants(DEBUG).json';

export default function Market() {
    const [items, setItems] = useState([]);
    const [selectedMerchant, setSelectedMerchant] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        const getItems = async () => {
            // Andrea: To Do: Actually gets a list of merchants and their items from the backend
            try {
                const items = await axios.get('http://localhost:3000/api/get-merchants');
                const merchants = items.data.merchants;
                console.log(merchants);
                setItems(merchants);
                console.log(items);
            }
            catch (error) {
                console.error(error);
            }
        };

        getItems();

        // DEBUG, load some merchant from a local json file
        //setItems(DEBUG_MERCHANTS.merchants);
    }, []);

    const handleModal = (address, items) => {
        setSelectedMerchant({ address, items });
        onOpen();
    }


    return (
        <Box className='quests-box'>
            <Text fontFamily='mephistoregular' fontSize='3rem' color='white' paddingTop='1rem' className='market title'>
                Welcome to the Market
            </Text>
            <hr style={{ margin: 'auto', marginBottom: '2rem', width: '80%' }} />
            <Text fontFamily='mephistoregular' fontSize='1.5rem' color='white' marginBottom='2rem'>
                Buy and sell your NFTs here
            </Text>
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                flexWrap='wrap'
                gap='1rem'
                marginBottom='2rem'
            >

                {/* Andrea: These are the DEBUG items */}
                {items.length > 0 && items.map((item, index) => (
                    item.items[0] && (
                        <Image key={index} src={Icon} className='quest' marginBottom='2rem' onClick={() => { handleModal(item.address, item.items) }} />
                    )
                ))}
            </Box>
            {selectedMerchant && <MarketModal selectedMerchant={selectedMerchant} isOpen={isOpen} onClose={onClose} />}
        </Box>
    )
};