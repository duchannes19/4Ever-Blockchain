// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FourEver {
    //----------------------------------------------
    // Contract begin
    //----------------------------------------------

    //----------------------------------------------
    // Enum
    //----------------------------------------------
    enum Rarity {
        Common,
        Uncommon,
        Rare,
        Epic,
        Legendary
    }

    //----------------------------------------------
    // Structures
    //----------------------------------------------

    struct NFT {
        address owner;
        string imageURL;
        string description;
        Rarity rarity;
    }

    struct Quest {
        //CesareDev: In a mapping all the value are initizialized to default value
        //           bool -> false, with this trick we can check if a quest is already registered
        bool registered;
        //CesareDev: users addresses -> users' quote
        mapping(address => uint256) participants;
        //CesareDev: Maybe add a NFT member that represents the reward
    }

    //----------------------------------------------
    // Events
    //----------------------------------------------

    event MemberJoined(address member);
    event NFTMinted(
        address owner,
        uint256 tokenId,
        string imageURL,
        string description
    );
    event QuestEnded(uint256 questId);
    event QuestRegistration(uint256 questId, address user);
    //----------------------------------------------
    // Contract memebers
    //----------------------------------------------

    //Market Member
    mapping(address => bool) public isMember;

    //NFT ID -> Concrete NFT
    mapping(uint256 => NFT) public NFTs;

    //Member -> NFT ID's
    mapping(address => uint256[]) public userNFTs;

    //Quest ID -> Quests
    mapping(uint256 => Quest) public quests;

    //----------------------------------------------
    // Functions
    //----------------------------------------------

    //----------------------------------------------
    // Connection
    //----------------------------------------------
    function joinMarketplace() public returns (bool) {
        if (!isMember[msg.sender]) {
            isMember[msg.sender] = true;
            emit MemberJoined(msg.sender);
            return true; // User joined successfully
        }
        return false; // User is already a member
    }

    function isUserMember(address user) public view returns (bool) {
        return isMember[user];
    }

    //----------------------------------------------
    // Quest
    //----------------------------------------------

    function joinQuest(uint256 questId) public payable {
        if (!quests[questId].registered) {
            quests[questId].registered = true;
        }
        //CesareDev: the check for the already existing user is done on the backend
        quests[questId].participants[msg.sender] = msg.value;
        emit QuestRegistration(questId, msg.sender);
    }

    function isAlreadyRegistered(
        uint256 questId,
        address user
    ) public view returns (bool) {
        return quests[questId].participants[user] > 0;
    }

    function refundUsers(uint256 questId) public {
        //CesareDev: Refound users if the quest doesn't start
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

    //----------------------------------------------
    // Contract end
    //----------------------------------------------
}
