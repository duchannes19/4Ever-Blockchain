// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FourEver {
    enum Rarity {
        Common,
        Uncommon,
        Rare,
        Epic,
        Legendary
    }

    struct NFT {
        address owner;
        string imageURL;
        string description;
        Rarity rarity;
    }

    //Market Member
    mapping(address => bool) public isMember;

    //NFT ID -> Concrete NFT
    mapping(uint256 => NFT) public NFTs;

    //Member -> NFT ID's
    mapping(address => uint256[]) public userNFTs;

    //Quest ID -> Memebers
    mapping(uint256 => address[]) public questParticipants;

    event MemberJoined(address member);

    event NFTMinted(
        address owner,
        uint256 tokenId,
        string imageURL,
        string description
    );

    event QuestEnded(uint256 questId);

    //----------------------------------------------
    // Connection
    //----------------------------------------------
    function joinMarketplace() public returns (bool) {
        address sender = msg.sender;

        if (!isMember[sender]) {
            isMember[sender] = true;
            emit MemberJoined(sender);
            return true; // User joined successfully
        } else {
            return false; // User is already a member
        }
    }

    function isUserMember(address user) public view returns (bool) {
        return isMember[user];
    }

    //----------------------------------------------
    // NFT
    //----------------------------------------------

    // Function to generate a pseudo-random NFT identifier
    function generateRandomNFT() internal view returns (uint256) {
        // In a real-world scenario, implement a secure random number generation algorithm
        // For demonstration purposes, a simple pseudo-random number is used here
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, block.basefee, msg.sender)
                )
            );
    }

    function mintNFT(string memory imageURL, string memory description) public {
        uint256 tokenId = generateRandomNFT();

        Rarity randomRarity = Rarity(
            uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, block.basefee, msg.sender)
                )
            ) % 5
        );
        NFTs[tokenId] = NFT(msg.sender, imageURL, description, randomRarity);
        userNFTs[msg.sender].push(tokenId);

        emit NFTMinted(msg.sender, tokenId, imageURL, description);
    }

    function getNFTsByOwner(
        address owner
    ) public view returns (uint256[] memory) {
        return userNFTs[owner];
    }
}
