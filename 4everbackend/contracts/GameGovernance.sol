// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameGovernance {
    address public owner;
    mapping(address => bool) public administrators;
    mapping(uint256 => bool) public proposals;
    uint256 public proposalCount;

    event ProposalCreated(uint256 indexed proposalId, address indexed proposer);
    event ProposalExecuted(uint256 indexed proposalId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyAdministrator() {
        require(administrators[msg.sender], "Not an administrator");
        _;
    }

    constructor() {
        owner = msg.sender;
        administrators[msg.sender] = true;
    }

    function addAdministrator(address account) external onlyOwner {
        administrators[account] = true;
    }

    function removeAdministrator(address account) external onlyOwner {
        administrators[account] = false;
    }

    function createProposal() external onlyAdministrator {
        proposalCount++;
        proposals[proposalCount] = true;

        emit ProposalCreated(proposalCount, msg.sender);
    }

    function executeProposal(uint256 proposalId) external onlyAdministrator {
        require(proposals[proposalId], "Proposal does not exist");

        // Add your proposal execution logic here

        // After executing the proposal, mark it as executed
        proposals[proposalId] = false;

        emit ProposalExecuted(proposalId);
    }
}
