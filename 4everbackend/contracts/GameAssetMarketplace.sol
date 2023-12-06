// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract GameAssetMarketplace is Ownable {
    using EnumerableSet for EnumerableSet.UintSet;

    IERC721 private _gameAssetContract;
    uint256 private _listingFee = 0.01 ether;

    EnumerableSet.UintSet private _listedAssets;

    event AssetListed(uint256 indexed tokenId, address indexed owner, uint256 price);
    event AssetSold(uint256 indexed tokenId, address indexed buyer, uint256 price);

    constructor(address gameAssetContract) {
        _gameAssetContract = IERC721(gameAssetContract);
    }

    function listAsset(uint256 tokenId, uint256 price) external payable {
        require(_gameAssetContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(!_listedAssets.contains(tokenId), "Asset already listed");
        require(price > 0, "Price must be greater than 0");

        _gameAssetContract.transferFrom(msg.sender, address(this), tokenId);
        _listedAssets.add(tokenId);

        emit AssetListed(tokenId, msg.sender, price);
    }

    function buyAsset(uint256 tokenId) external payable {
        require(_listedAssets.contains(tokenId), "Asset not listed");
        uint256 price = msg.value;
        address seller = _gameAssetContract.ownerOf(tokenId);

        require(price > 0, "Invalid price");
        require(msg.sender != seller, "Cannot buy own asset");

        _gameAssetContract.transferFrom(address(this), msg.sender, tokenId);
        _listedAssets.remove(tokenId);
        payable(seller).transfer(price);

        emit AssetSold(tokenId, msg.sender, price);
    }

    function getListingFee() external view returns (uint256) {
        return _listingFee;
    }

    function setListingFee(uint256 newFee) external onlyOwner {
        _listingFee = newFee;
    }

    function getAssetListingStatus(uint256 tokenId) external view returns (bool) {
        return _listedAssets.contains(tokenId);
    }
}
