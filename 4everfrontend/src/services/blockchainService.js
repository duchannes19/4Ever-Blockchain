import Web3 from 'web3';

const getWeb3 = async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        return window.web3;
    } else {
        alert('Please install MetaMask');
        return null;
    }
};

export default getWeb3;
