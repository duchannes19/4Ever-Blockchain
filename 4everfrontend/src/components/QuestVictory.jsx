import { Box } from "@chakra-ui/react";
import { TypeAnimation } from 'react-type-animation';

// Andrea: This component just gives a nice effect to simulate the victory of the quest
const QuestVictory = () => {
    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="transparent"
            backdropFilter="blur(10px)"
            zIndex={9999}
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <TypeAnimation
                sequence={[
                    'Easily storming through the castle',
                    1000, 
                    'Defeating the guards',
                    1000,
                    'The dragon is no match for you',
                    1000,
                    'Oh look, the dragon had a treasure chest!',
                    1000
                ]}
                wrapper="span"
                speed={50}
                style={{ fontSize: '2em', display: 'inline-block', color: 'white', fontFamily: 'mephistoregular' }}
            />
        </Box>
    );
};

export default QuestVictory;
