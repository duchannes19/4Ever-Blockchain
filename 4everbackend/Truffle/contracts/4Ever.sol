// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title 4Ever
/// @author Cesare Corsi, Andrea Massignan
/// @notice Marketplace and quests handler
/// @custom:notes The contract may be inefficient regard gas costs
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
        //Description of the NFT: This is purely for the frontend display
        string description;
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

    /// @notice Event emitted when a user join the marketplace
    /// @param member Address of the new member
    event MemberJoined(address member);

    /// @notice Event emitted when a NFT is minted
    /// @param owner Address of th owner of the minted NFT
    /// @param tokenId Id of the minted NFT
    event NFTMinted(address owner, uint256 tokenId);

    /// @notice Event emitted when a quest is ended
    /// @param questId The id of the ended quest
    /// @param winner Address of the winner
    event QuestEnded(uint256 questId, address winner);

    /// @notice Event emitted when a quest is ended
    /// @param questId The id of the starting quest
    /// @param user Address of the participant
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

    /// @notice Allows to a user to join the marketplace
    function joinMarketplace() public {
        require(!member[msg.sender].isMember);
        member[msg.sender].isMember = true;
        emit MemberJoined(msg.sender);
    }

    /// @notice Check if a user is already a member
    /// @param user The address of a user
    /// @return True if the user is already a member, false otherwise
    function isUserMember(address user) public view returns (bool) {
        return member[user].isMember;
    }

    /// @notice Function to get all the NFT on sale
    /// @return Array of all the NFT on sale
    function getSellNFTs() public view returns (NFT[] memory) {
        return availableNFTs;
    }

    /// @notice Put a NFT for sale adding it in the market
    /// @param tokenId The id of the NFT
    function sellNFT(uint256 tokenId) public {
        require(
            member[msg.sender].isMember &&
                member[msg.sender].nfts.length > tokenIndexing[tokenId] &&
                member[msg.sender].nfts[tokenIndexing[tokenId]].owner == msg.sender &&
                !member[msg.sender].nfts[tokenIndexing[tokenId]].onSale
        );
        member[msg.sender].nfts[tokenIndexing[tokenId]].onSale = true;
        availableNFTs.push(member[msg.sender].nfts[tokenIndexing[tokenId]]);
    }

    /// @notice Remove a NFT for sale removing it from the market
    /// @param tokenId The id of the NFT
    function unsellNFT(uint256 tokenId) public {
        require(
            member[msg.sender].isMember &&
                member[msg.sender].nfts.length > tokenIndexing[tokenId] &&
                member[msg.sender].nfts[tokenIndexing[tokenId]].owner == msg.sender &&
                member[msg.sender].nfts[tokenIndexing[tokenId]].onSale
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

    /// @notice Allows an user to buy a NFT in the market
    /// @param tokenId The id of the NFT
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
                break;
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

    /// @notice Allows an user to join a quest
    /// @param company The address of the company that has published the quest
    /// @param questId The id of the quest
    /// @param seed The seed used for extracting the winner
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

    /// @notice Ends a specific quest, extracts a winner and assign a NFT.
    /// @param winner The address of the quest's winner
    /// @param questId The id of the quest
    /// @param tokenId The id of the NFT
    /// @param url The url of the asset related to the NFT
    /// @param name The name of the asset
    /// @param description The descritpion of the asset
    /// @dev The description is ussed only in the frontend and its not mandatory
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

    /// @notice Function used to get the quest seed for extracting a winner
    /// @param questId The id of the quest
    /// @return uint256 The quest seed
    function getQuestSeed(uint256 questId) public view returns (uint256) {
        return quests[questId].seed;
    }

    /// @notice Function used to get the number of the participants in a quest 
    /// @param questId The id of the quest
    /// @return uint256 The number of the participants
    function getQuestParticipantsNumber(
        uint256 questId
    ) public view returns (uint256) {
        return quests[questId].totalParticipants;
    }

    //----------------------------------------------
    // NFT
    //----------------------------------------------

    /// @notice Function used to get all the NFTs owned by a member
    /// @param owner The owner of the NFTs
    /// @return Array of all the NFTs owner by a member
    function getNFTs(address owner) public view returns (NFT[] memory) {
        return member[owner].nfts;
    }

    /// @notice Function used to calculate the rariry of the NFT based on the number of participants in a quest
    /// @param participants Number of participants in a quest
    /// @return Rarity The rarity of the NFT
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
