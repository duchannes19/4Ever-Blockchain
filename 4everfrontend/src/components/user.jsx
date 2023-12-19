import React from 'react';

import { Avatar, Menu, MenuButton, MenuList, MenuItem, Box } from '@chakra-ui/react';

import AvatarImg from '/img/avatar.jpeg';

import { Text } from '@chakra-ui/react';

const User = ({ reset }) => {

    const account = localStorage.getItem('accounts');
    const balance = localStorage.getItem('balance');
    const nfts = localStorage.getItem('nfts');

    return (
        <Box>
            <Menu>
                <MenuButton as={Avatar} size="md" name={account} src={AvatarImg} style={{cursor: 'pointer'}}/>
                <MenuList>
                    <MenuItem textAlign={'center'} flexDir={'column'} justifyContent={'center'} pointerEvents={'none'} _focus={{ outline: 'none' }}>
                        <Text fontWeight="bold">User</Text>
                        <Text fontSize="sm">{account}</Text>
                    </MenuItem>
                    <hr style={{width: '80%', margin: 'auto'}}/>
                    <MenuItem textAlign={'center'} flexDir={'column'} justifyContent={'center'} pointerEvents={'none'} _focus={{ outline: 'none' }}>
                        <Text fontWeight="bold">Balance</Text><br/>{balance}
                    </MenuItem>
                    <hr style={{width: '80%', margin: 'auto'}}/>
                    <MenuItem textAlign={'center'} flexDir={'column'} justifyContent={'center'} pointerEvents={'none'} _focus={{ outline: 'none' }}>
                        <Text fontWeight="bold">NFTs</Text><br/>{nfts}
                    </MenuItem>
                    <hr style={{width: '80%', margin: 'auto'}}/>
                    <MenuItem textAlign={'center'} 
                    justifyContent={'center'} 
                    background={'lightgray'} 
                    margin={'auto'}
                    marginTop={'1rem'}
                    width={'80%'}
                    onClick={reset}><b>Logout</b></MenuItem>
                </MenuList>
            </Menu>
        </Box>
    );
};

export default User;
