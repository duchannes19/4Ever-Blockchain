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
        //Description of the NFT
        string description; // -> Andrea: This is purely for the frontend display
        //Is the NFT on sale
        bool onSale;
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

    //NFT ID -> Index in the user's array
    mapping(uint256 => uint256) tokenIndexing;

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

    function getSellNFTs() public view returns (NFT[] memory) {
        return availableNFTs;
    }

    function sellNFT(uint256 tokenId) public {
        require(
            member[msg.sender].isMember &&
                member[msg.sender].nfts.length > tokenIndexing[tokenId] &&
                member[msg.sender].nfts[tokenIndexing[tokenId]].owner ==
                msg.sender
        );
        member[msg.sender].nfts[tokenIndexing[tokenId]].onSale = true;
        availableNFTs.push(member[msg.sender].nfts[tokenIndexing[tokenId]]);
    }

    function unsellNFT(uint256 tokenId) public {
        require(
            member[msg.sender].isMember &&
                member[msg.sender].nfts.length > tokenIndexing[tokenId] &&
                member[msg.sender].nfts[tokenIndexing[tokenId]].owner ==
                msg.sender
        );
        member[msg.sender].nfts[tokenIndexing[tokenId]].onSale = false;
        for (uint256 i = 0; i < availableNFTs.length; i++) {
            if (availableNFTs[i].id == tokenId) {
                if (availableNFTs.length > 1) {
                    availableNFTs[i] = availableNFTs[availableNFTs.length - 1];
                    availableNFTs.pop();
                } else {
                    availableNFTs.pop();
                }
                break;
            }
        }
    }

    function buyNFT(uint256 tokenId) public payable {
        require(member[msg.sender].isMember);
        address payable oldOwner;
        //Remove the nft from the market
        for (uint256 i = 0; i < availableNFTs.length; i++) {
            if (availableNFTs[i].id == tokenId) {
                oldOwner = payable(availableNFTs[i].owner);
                if (availableNFTs.length > 1) {
                    availableNFTs[i] = availableNFTs[availableNFTs.length - 1];
                    availableNFTs.pop();
                } else {
                    availableNFTs.pop();
                }
            }
        }
        if (oldOwner > address(0)) {
            uint256 oldNFTIndex = tokenIndexing[tokenId];
            //Push the nft in the new owner list
            member[msg.sender].nfts.push(member[oldOwner].nfts[oldNFTIndex]);
            member[msg.sender]
                .nfts[member[msg.sender].nfts.length - 1]
                .owner = msg.sender;
            //Remove onSale flag
            member[msg.sender]
                .nfts[member[msg.sender].nfts.length - 1]
                .onSale = false;
            //Set the new index in the tokenIndexing mapping
            tokenIndexing[tokenId] = member[msg.sender].nfts.length - 1;
            //Remove the nft from the old owner array
            if (member[oldOwner].nfts.length > 1) {
                member[oldOwner].nfts[oldNFTIndex] = member[oldOwner].nfts[
                    member[oldOwner].nfts.length - 1
                ];
                //if the token wasn't last element we must change the index of
                //the swapped element in the token mapping
                if (oldNFTIndex < member[oldOwner].nfts.length - 1) {
                    uint256 id = member[oldOwner]
                        .nfts[member[oldOwner].nfts.length - 1]
                        .id;
                    tokenIndexing[id] = oldNFTIndex;
                }
                member[oldOwner].nfts.pop();
            } else {
                member[oldOwner].nfts.pop();
            }
        }
        //Do the payment
        oldOwner.transfer(msg.value);
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
        string memory name,
        string memory description
    ) public {
        //msg.sender is the company
        quests[questId].ended = true;
        //Mint NFT
        tokenIndexing[tokenId] = member[winner].nfts.length;
        member[winner].nfts.push(
            NFT(
                tokenId,
                winner,
                msg.sender,
                url,
                name,
                calculateRarity(quests[questId].totalParticipants),
                description,
                false
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

    function getNFTs(address owner) public view returns (NFT[] memory) {
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
