// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FourEver {
    mapping(address => bool) public isMember;
    mapping(address => uint256) public userNFTs;

    event MemberJoined(address indexed member);

    // Function to generate a random NFT identifier
    function generateRandomNFT() internal view returns (uint256) {
        // In a real-world scenario, implement a secure random number generation algorithm
        // For demonstration purposes, a simple pseudo-random number is used here
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.basefee, msg.sender))) % 1000;
    }

    function joinMarketplace() public returns (bool) {
        address sender = msg.sender;

        if (!isMember[sender]) {
            isMember[sender] = true;

            // Assign a random NFT to the user
            userNFTs[sender] = generateRandomNFT();

            emit MemberJoined(sender);
            return true; // User joined successfully
        } else {
            return false; // User is already a member
        }
    }

    function AddNFTtoUser(address user, uint256 NFT) public returns (bool) {
        if (isMember[user] && userNFTs[user] == 0) {
            userNFTs[user] = NFT;
            return true;
        } else {
            return false;
        }
    }

    function isUserMember(address user) public view returns (bool) {
        return isMember[user];
    }

    function getUserNFTs(address user) public view returns (uint256[] memory) {
        uint256[] memory userNFTList = new uint256[](1);
        userNFTList[0] = userNFTs[user];
        return userNFTList;
    }

    function getAllNFTs(address user) public view returns (uint256[] memory) {
        uint256[] memory allNFTs = new uint256[](1000);
        uint256 index = 0;

        for (uint256 i = 0; i < 1000; i++) {
            if (i != userNFTs[user]) {
                allNFTs[index] = i;
                index++;
            }
        }

        uint256[] memory filteredNFTs = new uint256[](index);
        for (uint256 i = 0; i < index; i++) {
            filteredNFTs[i] = allNFTs[i];
        }

        return filteredNFTs;
    }
}
