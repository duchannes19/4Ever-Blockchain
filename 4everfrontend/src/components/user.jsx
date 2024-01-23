import React from 'react';

import { useState, useEffect } from 'react';
import { Avatar, Menu, MenuButton, MenuList, MenuItem, Box, Text } from '@chakra-ui/react';

import MyNFTs from './NFTsModal';

import AvatarImg from '/img/avatar.jpeg';

const User = ({ reset }) => {

    const [account, setAccount] = useState(localStorage.getItem('accounts'));
    const [balance, setBalance] = useState(localStorage.getItem('balance'));
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

    return (
        <Box>
            <Menu>
                <MenuButton as={Avatar} size="md" name={account} src={AvatarImg} style={{ cursor: 'pointer' }} />
                <MenuList>
                    <MenuItem textAlign={'center'} flexDir={'column'} justifyContent={'center'} pointerEvents={'none'} _focus={{ outline: 'none' }}>
                        <Text fontWeight="bold">User</Text>
                        <Text fontSize="sm">{account}</Text>
                    </MenuItem>
                    <hr style={{ width: '80%', margin: 'auto' }} />
                    <MenuItem textAlign={'center'} flexDir={'column'} justifyContent={'center'} pointerEvents={'none'} _focus={{ outline: 'none' }}>
                        <Text fontWeight="bold">Balance</Text><br />{balance}
                    </MenuItem>
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
