// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FourEver {
    //----------------------------------------------
    // Contract begin
    //----------------------------------------------

    //----------------------------------------------
    // Structures
    //----------------------------------------------

    enum Rarity {
        Common,
        Uncommon,
        Rare,
        Epic,
        Legendary
    }

    struct NFT {
        //Token ID
        uint256 id;
        //Owner of the NFT
        address owner;
        //Assets's Company
        address company;
        //URL of the image
        string url;
        //Name of the NFT
        string name;
        //Rarity of the NFT
        Rarity rarity;
    }

    struct User {
        //Is user member
        bool isMember;
        //All user's NFTs
        NFT[] nfts;
    }

    struct Quest {
        //Participants number
        uint256 totalParticipants;
        //For random userWinnerSelection
        uint256 seed;
        //Member to check if the quest ended
        bool ended;
        //Users addresses -> users' quote
        mapping(address => uint256) participants;
        //Winner address
        address winner;
        //Company address
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

    //Shop
    NFT[] public availableNFTs;

    //Addres -> Market member
    mapping(address => User) public member;

    //Quest ID -> Quests
    mapping(uint256 => Quest) public quests;

    //----------------------------------------------
    // Functions
    //----------------------------------------------

    //----------------------------------------------
    // Market
    //----------------------------------------------

    function joinMarketplace() public {
        require(!member[msg.sender].isMember);
        member[msg.sender].isMember = true;
        emit MemberJoined(msg.sender);
    }

    function isUserMember(address user) public view returns (bool) {
        return member[user].isMember;
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

        //Emit event
        emit QuestRegistration(questId, msg.sender);
    }

    function endQuest(
        address winner,
        uint256 questId,
        uint256 tokenId,
        string memory url,
        string memory name
    ) public {
        //msg.sender is the company
        quests[questId].ended = true;
        //Mint NFT
        member[winner].nfts.push(
            NFT(
                tokenId,
                winner,
                msg.sender,
                url,
                name,
                calculateRarity(quests[questId].totalParticipants)
            )
        );
        //Emit events
        emit QuestEnded(questId, winner);
        emit NFTMinted(winner, tokenId);
    }

    function getQuestSeed(uint256 questId) public view returns (uint256) {
        return quests[questId].seed;
    }

    function getQuestParticipantsNumber(
        uint256 questId
    ) public view returns (uint256) {
        return quests[questId].totalParticipants;
    }

    //----------------------------------------------
    // NFT
    //----------------------------------------------

    function getNFTsByOwner(address owner) public view returns (NFT[] memory) {
        return member[owner].nfts;
    }

    function calculateRarity(
        uint256 participants
    ) internal pure returns (Rarity) {
        if (participants <= 10) {
            return Rarity.Common;
        } else if (participants <= 50) {
            return Rarity.Uncommon;
        } else if (participants <= 100) {
            return Rarity.Rare;
        } else if (participants <= 500) {
            return Rarity.Epic;
        }
        return Rarity.Legendary;
    }

    //----------------------------------------------
    // Contract end
    //----------------------------------------------
}
