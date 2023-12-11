import { Button } from '@chakra-ui/react';

const JoinMarketplace = () => {

    const userAddress = localStorage.getItem('accounts');

    const handleJoinMarketplace = async () => {
        try {
            // Make a request to your backend to join the marketplace
            const response = await fetch('http://localhost:5000/api/join-marketplace', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userAddress }),
            });

            // Handle the response accordingly
            const data = await response.json();
            console.log('Join Marketplace Response:', data);

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
};

export default JoinMarketplace;
