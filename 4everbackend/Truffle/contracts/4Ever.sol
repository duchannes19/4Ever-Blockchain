// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FourEver {
    address[] public members;
    mapping(address => bool) public isMember;

    event MemberJoined(address indexed member);

    function joinMarketplace() public returns (bool) {
        address sender = msg.sender;
        
        if (!isMember[sender]) {
            members.push(sender);
            isMember[sender] = true;
            emit MemberJoined(sender);
            return true; // User joined successfully
        } else {
            return false; // User is already a member
        }
    }

    function getMembers() public view returns (address[] memory) {
        return members;
    }

    function isUserMember(address user) public view returns (bool) {
        return isMember[user];
    }
}
