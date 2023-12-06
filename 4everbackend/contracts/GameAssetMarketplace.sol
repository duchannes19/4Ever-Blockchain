// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameAssetMarketplace {
    address public owner;
    mapping(uint256 => bool) public assetListings;
    mapping(uint256 => uint256) public assetPrices;

    event AssetListed(uint256 indexed tokenId, address indexed owner, uint256 price);
    event AssetSold(uint256 indexed tokenId, address indexed buyer, uint256 price);

    constructor() {
        owner = msg.sender;
    }

    function listAsset(uint256 tokenId, uint256 price) external {
        require(msg.sender == owner, "Not the owner");
        require(!assetListings[tokenId], "Asset already listed");
        require(price > 0, "Price must be greater than 0");

        assetListings[tokenId] = true;
        assetPrices[tokenId] = price;

        emit AssetListed(tokenId, msg.sender, price);
    }

    function buyAsset(uint256 tokenId) external payable {
        require(assetListings[tokenId], "Asset not listed");
        require(msg.value == assetPrices[tokenId], "Incorrect payment amount");

        address seller = owner;
        address buyer = msg.sender;

        assetListings[tokenId] = false;
        assetPrices[tokenId] = 0;

        payable(seller).transfer(msg.value);

        emit AssetSold(tokenId, buyer, msg.value);
    }
}
