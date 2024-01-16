// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FourEver {
    //----------------------------------------------
    // Contract begin
    //----------------------------------------------


    //----------------------------------------------
    // Structures
    //----------------------------------------------

    struct NFT {
        address owner;
    }

    struct Quest {
        //CesareDev: participants number
        uint256 totalParticipants;
        //CesareDev: for random userWinnerSelection
        uint256 seed;
        //CesareDev: member to check if the quest ended
        bool ended;
        //CesareDev: users addresses -> users' quote
        mapping(address => uint256) participants;
        //Andrea: winner address
        address winner;
        //Andrea: company address
        address companyaddress;
    }

    //----------------------------------------------
    // Events
    //----------------------------------------------

    event MemberJoined(address member);
    event NFTMinted(address owner, uint256 tokenId);
    event QuestEnded(uint256 questId, address winner);
    event QuestRegistration(uint256 questId, address user);

    //----------------------------------------------
    // Contract memebers
    //----------------------------------------------

    //Market Member
    mapping(address => bool) public isMember;

    //Quest ID -> Quests
    mapping(uint256 => Quest) public quests;

    //NFT ID -> Concrete NFT
    mapping(uint256 => NFT) public NFTs;

    //Member -> NFT ID's
    mapping(address => uint256[]) public userNFTs;

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

    function joinQuest(
        address company,
        uint256 questId,
        uint128 seed
    ) public payable {
        //CesareDev: the check for the already existing user is done on the backend
        require(quests[questId].participants[msg.sender] == 0);
        quests[questId].seed += seed;

        // Send the payment to the company address
        address payable companyAddress = payable(company);
        companyAddress.transfer(msg.value);

        //Register the quote of the participant
        quests[questId].participants[msg.sender] = msg.value;
        quests[questId].totalParticipants++;
        emit QuestRegistration(questId, msg.sender);
    }

    function endQuest(uint256 questId) public {
        quests[questId].ended = true;
        //CesareDev: Implements quest winner: mint NFT

        emit QuestEnded(questId, msg.sender);
    }

    function getQuestSeed(uint256 questId) public view returns (uint256) {
        return quests[questId].seed;
    }

    //----------------------------------------------
    // NFT
    //----------------------------------------------

    // Function to mint NFT
    function mintNFT(address owner, uint256 questId) public {
        // company is msg.sender

        // Generate tokenId based on the questId
        uint256 tokenId = questId;

        // Create a new NFT with the specified owner
        NFT memory newNFT = NFT(owner);

        // Assign the NFT to the tokenId
        NFTs[tokenId] = newNFT;

        // Add the tokenId to the owner's list of NFTs
        userNFTs[owner].push(tokenId);

        // Emit the NFTMinted event
        emit NFTMinted(owner, tokenId);
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
