import { Button } from '@chakra-ui/react';
import axios from 'axios';

import Notify from './Notify';

export default function JoinMarketplace() {

    const userAddress = localStorage.getItem('accounts');

    const handleJoinMarketplace = async () => {
        try {
            // Make a request to your backend to join the marketplace
            const response = await axios.post('http://localhost:3000/api/join-marketplace', {
                userAddress: userAddress
            });

            // Handle the response accordingly
            if (response.data.success) {
                console.log('Join Marketplace Response:', response.data.message);
                Notify('success', response.data.message);
            }
            else {
                console.log('Join Marketplace Error:', response.data.message);
                Notify('error', response.data.message);
            }

        } catch (error) {
            console.error('Error joining the marketplace:', error);
            Notify('error', error.message);
        }
    };

    return (
        <Button onClick={handleJoinMarketplace}>
            Join
        </Button>
    );
}
