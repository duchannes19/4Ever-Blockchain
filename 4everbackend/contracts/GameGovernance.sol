// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GameGovernance is Ownable {
    mapping(address => uint256) private _votingPower;

    event VoteCasted(address indexed voter, uint256 votingPower);

    modifier hasVotingPower() {
        require(_votingPower[msg.sender] > 0, "No voting power");
        _;
    }

    function getVotingPower(address voter) external view returns (uint256) {
        return _votingPower[voter];
    }

    function delegateVotingPower(address delegatee, uint256 votingPower) external onlyOwner {
        _votingPower[delegatee] = votingPower;
    }

    function castVote() external hasVotingPower {
        // Perform governance action
        // For simplicity, this function can be expanded with specific actions based on voting power.
        
        emit VoteCasted(msg.sender, _votingPower[msg.sender]);
    }
}
