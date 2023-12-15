import { Button } from '@chakra-ui/react';
import axios from 'axios';

import Notify from './Notify';

export default function JoinMarketplace({ setStep1 , setStep2 }) {

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
                setStep2(true);
                setTimeout(() => {
                    setStep1(false);
                }, 3000);
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
