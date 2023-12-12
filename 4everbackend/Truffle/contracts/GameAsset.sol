// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameAsset {
    address public owner;
    mapping(uint256 => address) public tokenOwners;

    event Transfer(address indexed from, address indexed to, uint256 tokenId);

    constructor() {
        owner = msg.sender;
    }

    function mint(address to, uint256 tokenId) external {
        require(msg.sender == owner, "Not the owner");
        require(tokenOwners[tokenId] == address(0), "Token already exists");

        tokenOwners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);
    }

    function transfer(address to, uint256 tokenId) external {
        require(msg.sender == tokenOwners[tokenId], "Not the owner");

        tokenOwners[tokenId] = to;

        emit Transfer(msg.sender, to, tokenId);
    }
}
