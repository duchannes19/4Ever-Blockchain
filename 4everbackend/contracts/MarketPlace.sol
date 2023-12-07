// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    mapping(address => bool) public marketplaceMembers;

    event UserJoinedMarketplace(address indexed user);

    function joinMarketplace() external {
        require(!marketplaceMembers[msg.sender], "User is already a member");

        marketplaceMembers[msg.sender] = true;

        emit UserJoinedMarketplace(msg.sender);
    }
}
