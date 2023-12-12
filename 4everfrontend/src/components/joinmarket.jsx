import { Button } from '@chakra-ui/react';
import axios from 'axios';
import Notify from './notify';

export default function JoinMarketplace() {

    const userAddress = localStorage.getItem('accounts');
    console.log(userAddress);

    const handleJoinMarketplace = async () => {
        try {
            // Make a request to your backend to join the marketplace
            const response = await axios.post('http://localhost:5000/api/join-marketplace', {
                userAddress: userAddress,
            });

            // Handle the response accordingly
            if (response.data.success) {
                console.log('Join Marketplace Response:', response.data.message);
                Notify('success', response.data.message);
            }
            else {
                console.log('Join Marketplace Error:', response.data.message);
            }
            // Add logic for further actions or UI updates

        } catch (error) {
            console.error('Error joining the marketplace:', error);
        }
    };

    return (
        <Button onClick={handleJoinMarketplace}>
            Join
        </Button>
    );
}
