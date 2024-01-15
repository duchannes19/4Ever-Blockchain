import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react";

const MyNFTs = ({ isOpen, onClose }) => {

    // Andrea: To do: Add axios call to get user's NFTs from the backend

    return (
        <Modal isOpen={isOpen} onClose={onClose} size='xl'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign='center'>My NFTs</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {/* Andrea: To do: Add NFTs here */}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default MyNFTs;
