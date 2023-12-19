# 4Ever

<p align="center">
  <img src="README_logo.png" alt="Title Image">
</p>

## Introduction

4Ever is an MMORPG-inspired decentralized application (DApp) that leverages blockchain technology to manage the in-game economy, asset ownership, and decentralized governance. The project aims to provide a secure and transparent environment for players to trade in-game assets, maintain ownership through NFTs (Non-Fungible Tokens), and participate in the governance of certain aspects of the game.

# Considerations

## Main Objective (For Now)

The main objective of this application (at the moment) is to be utilized in the next generation of online Massively Multiplayer Online Role-Playing Games (MMORPGs). Its focus is on facilitating the exchange and verification of asset ownership among players.

## To Do (To be Updated)

Instead of directly creating traditional Non-Fungible Tokens (NFTs), the contract simulates a function that assigns in-game quests (common in MMORPGs). Upon quest completion, players receive a unique item (NFT) as a reward. These items differ from one another, potentially categorized by rarity (common, uncommon, rare, epic, legendary), each having a fixed price based on its rarity. Players can then sell or exchange items of similar price range. Consider the addition of a whistleblowing mechanism.

## Advantages

- **No Duplicates:** Each item received as a quest reward is unique, eliminating the possibility of duplicates in the game.
- **No Scams:** The blockchain-based ownership verification ensures a secure and scam-resistant environment.
- **Complete Ownership:** Players have full ownership of their in-game assets, fostering a sense of true ownership.

## Limitations

- **MetaMask Dependency:** The application relies on MetaMask for user interaction, limiting accessibility to users with a MetaMask wallet.
- **Game Development Limitation:** The application does not cover the development of the actual MMORPG game. Integration with an existing game or the development of a game itself is necessary for full functionality.

## Develop rule (TEMP)

<ins>Non-mandatory but appreciated rules for keeping code clean and well-organized, facilitating readability and teamwork.</ins>😄😄😄😄😄😄😄😄😄

### Naming convention

- **Semicolon**: 

    ```js
    let i = 0;
    ```

- **Component File and Component itself**: `UpperToLower.jsx`
    
    ```js
    function MyComponent(...) {

    }
    ```

- **Variable, Props and Function**: `lowerToUpper`

    ```js
    let accountBalance = getAccountBalance();
    ```

    ```html
    <MyComponent propOne={...} propTwo={...} />
    ```

### Adding new component

- `Component.jsx`
    ```js
    export default function Component(...) {
        ...
        return (
            ...
        );
    }
    ```
- When importing

    ```js
    import Component from "path/Component";

    export default function OtherComponent(...) {

        return (
            ...
            <Component />
            ...
        );

    }
    ```
    
### Adding images, fonts or static resources

- Put the resources in `4everfrontend/public` folder
- Import them like this:

    ```js
    import logo from "/img/logo.png";
    ```

### Importing order

```js
import { Component, func, ... } from "react" or "external modules";
import { Component, func, ... } from "chakraui" or "external modules";
//Empty line
import Component1 from "./user_defined_component";
import Component2 from "./user_defined_component";
//Empty line
import resource from "local resources (png, css, ...)";
```

### Commenting

If you are working on something unfinished it would be appreciated if you added a comment somewhere in the code like:

```js
//TODO: username
```

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
- Launche the workspace
- In the root folder of the repo `4Ever-Blockchain` run

    ```bash
    npm run truffle
    ```

- Copy the contract address found in the log in the console and replace the `MARKETADDR` in the `.env` file located in `4everbackend/.env`
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
- ... Coming soon