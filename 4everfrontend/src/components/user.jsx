import React from 'react';
import Web3 from 'web3';

import { useState, useEffect } from 'react';
import { Avatar, Menu, MenuButton, MenuList, MenuItem, Box, Text, Image } from '@chakra-ui/react';
import { FiRefreshCcw } from "react-icons/fi";

import MyNFTs from './NFTsModal';

import AvatarImg from '/img/avatar.jpeg';

const User = ({ reset }) => {

    const [account, setAccount] = useState(localStorage.getItem('accounts'));
    const [balance, setBalance] = useState(localStorage.getItem('balance'));
    const [refresh, setRefresh] = useState(false);
    const [NFTsModal, setNFTsModal] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            setAccount(localStorage.getItem('accounts'));
            setBalance(localStorage.getItem('balance'));
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleRefresh = async () => {
        // Andrea: Get the balance of the connected account
        setRefresh(true);
        const web3 = new Web3(window.ethereum);
        const balance = await web3.eth.getBalance(account);
        setBalance(web3.utils.fromWei(balance, 'ether'));
        setTimeout(() => {
            setRefresh(false);
        }, 1000);
    };

    return (
        <Box>
            <Menu>
                <MenuButton as={Avatar} size="md" name={account} src={AvatarImg} style={{ cursor: 'pointer' }} />
                <MenuList>
                    <MenuItem textAlign={'center'} flexDir={'column'} justifyContent={'center'} pointerEvents={'none'} _focus={{ outline: 'none' }}>
                        <Image src="/img/user.png" alt="ether" className='menu-icon' />
                        <Text fontSize="sm">{account}</Text>
                    </MenuItem>
                    <hr style={{ width: '80%', margin: 'auto' }} />
                    <Box style={{ display: 'flex', textAlign: 'center', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '0.5rem', marginBottom: '0.5rem' }} _focus={{ outline: 'none' }}>
                        <Image src="/img/balance_eth.png" alt="ether" className='menu-icon' style={{ pointerEvents: 'none' }} />
                        <b>{balance}</b>
                        <FiRefreshCcw className={`refresh_eth ${refresh ? 'clicked' : ''}`} onClick={handleRefresh} />
                    </Box>
                    <hr style={{ width: '80%', margin: 'auto' }} />
                    <MenuItem textAlign={'center'}
                        justifyContent={'center'}
                        background={'lightgray'}
                        margin={'auto'}
                        marginTop={'1rem'}
                        width={'80%'}
                        onClick={() => setNFTsModal(true)}
                    >
                        <Text fontWeight="bold">NFTs</Text><br />
                    </MenuItem>
                    <hr style={{ width: '80%', margin: 'auto', marginTop: '1rem' }} />
                    <MenuItem textAlign={'center'}
                        justifyContent={'center'}
                        background={'lightgray'}
                        margin={'auto'}
                        marginTop={'1rem'}
                        width={'80%'}
                        onClick={reset}><b>Logout</b></MenuItem>
                </MenuList>
            </Menu>
            {NFTsModal && <MyNFTs isOpen={NFTsModal} onClose={() => setNFTsModal(false)} />}
        </Box>
    );
};

export default User;
