import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
} from '@chakra-ui/react';

export default function HelpModal() {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const colorMode = 'dark';

    return (
        <>
            <Button fontFamily={'mephistoregular'} onClick={onOpen}>Help</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg={colorMode === 'dark' ? 'gray.800' : 'white'} color={colorMode === 'dark' ? 'white' : 'black'} margin={'1rem'}>
                    <ModalHeader>Requirements</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody margin={'0.5rem'}>
                        <ol>
                            <li>Go to the <a href="https://metamask.io/download.html" target="_blank" rel="noreferrer" style={{ color: 'darkgreen' }}>MetaMask website</a></li>
                            <li>Click on "Get Chrome Extension" or "Get Firefox Extension"</li>
                            <li>Follow the instructions to install MetaMask</li>
                            <li>Create a new MetaMask account or import an existing one</li>
                            <li>Set up a password and backup your seed phrase</li>
                            <li>Connect MetaMask to your browser</li>
                        </ol>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='gray' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}