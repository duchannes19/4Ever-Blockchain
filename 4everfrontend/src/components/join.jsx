import { Button } from '@chakra-ui/react';
import axios from 'axios';

import Notify from './Notify';

export default function Join({ setStep1 , setStep2 }) {

    const userAddress = localStorage.getItem('accounts');

    const handleJoinMarketplace = async () => {
        try {
            // Make a request to your backend to join the marketplace
            const response = await axios.post('http://localhost:3000/api/join-marketplace', {
                userAddress: userAddress
            });

            // Handle the response accordingly
            if (response.data.success) {
                console.log('Join Response:', response.data.message);

                localStorage.setItem('isjoined', true);
                localStorage.setItem('nfts', response.data.nfts);

                Notify('success', response.data.message);
                
                window.scrollTo({ top: 0, behavior: 'smooth' });

                setStep2(true);
                setStep1(false);
            }
            else {
                console.log('Join Error:', response.data.message);
                Notify('error', response.data.message);
            }

        } catch (error) {
            console.error('Error joining:', error);
            Notify('error', error.message);
        }
    };

    return (
        <Button onClick={handleJoinMarketplace}>
            Join
        </Button>
    );
}
