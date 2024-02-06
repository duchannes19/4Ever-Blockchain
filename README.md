# 4Ever

<p align="center">
  <img src="README_logo.png" alt="Title Image">
</p>

## Introduction

4Ever is an MMORPG-inspired decentralized application (DApp) that leverages blockchain technology to manage the in-game economy, specifically asset ownership. The project aims to provide a secure and transparent environment for players to trade in-game assets and maintain ownership through NFTs (Non-Fungible Tokens), introducing also a simulated reward system through quests.

## Setup

### Prerequisites

Make sure you have the following installed:

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- npm (Node Package Manager): Installed with Node.js
- Truffle: [Install Truffle](https://www.trufflesuite.com/truffle)
- Ganache: [Install Ganache](https://trufflesuite.com/ganache/)
- Metamask: [Install Metamask](https://metamask.io/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/4Ever.git
   cd 4Ever

2. Install dependencies:
    ```bash
    npm run install-all
    
## Usage

- First of all open Ganache and add a new workspace
    - In the Truffle Prject add the `truffle-config.js` file located `4everbackend/Truffle/truffle-config.js`
- Launch the workspace
- In the root folder of the repo `4Ever-Blockchain` run

    ```bash
    npm run truffle
    ```
    
    ```bash
    npm run database
    ```

- To configure Metamask to use Ganache network:

1. Open Metamask extension in your browser.
2. Click on the Metamask extension icon to open the wallet.
3. Click on the network dropdown (usually displaying "Main Ethereum Network" or "Rinkeby Test Network") and select "Custom RPC".
4. In the "New Network" section, enter the following details:
   - Network Name: Ganache (or any name you prefer)
   - New RPC URL: http://localhost:7545 (or the RPC server URL provided by your Ganache instance)
   - Chain ID: 1337 (or the chain ID provided by your Ganache instance)
   - Currency Symbol: ETH (or any symbol you prefer)
5. Click "Save" to add Ganache as a network in Metamask.
6. Now, to add a user using their private key:
   - Open Ganache and copy the private key of the desired account.
   - In Metamask, click on the account icon at the top right corner and select "Import Account".
   - Paste the private key in the "Private Key" field.
   - Optionally, enter a password to encrypt the imported account.
   - Click "Import" to add the user account to Metamask.
7. You should now see the imported account in Metamask, and you can select it to interact with the Ganache network.

- From the root folder `4Ever-Blockchain` run (Separated terminal):

    ```bash
    npm run server
    ```

    ```bash
    npm run client
    ```
- Open the client side address
- Connnect to Metamask with one of the account in the ganache blockchain (Tutorial in the slides)
- Press the `Connect` buttonin the middle of the page
- Press `Join` button
- **Explore the Market**: Discover and trade in-game assets with other players in the decentralized marketplace.
- **Embark on Quests**: Engage in (simulated) quests to earn your NFTs.
