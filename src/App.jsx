import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'; 
import Web3 from 'web3';
import nftContract from './nftContract';
import './App.css';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [mintAmount, setMintAmount] = useState(1); 
  const [isConnected, setIsConnected] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [nftImages, setNftImages] = useState([]);  // New state for connection status

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.requestAccounts();
        setAccounts(accounts);

        const instance = nftContract(web3Instance);
        setContract(instance);

        setIsConnected(true); // Set connection status to true after successful connection

      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Web3 not found');
    }
  };

  const promptForMintAmount = () => {
    const userAmount = prompt("Enter the number of NFTs you want to mint:", mintAmount);
    const parsedAmount = parseInt(userAmount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Invalid number of NFTs. Please enter a positive integer.");
    } else {
      setMintAmount(parsedAmount);
    }
  }; 

  const mint = async () => {
    try {
      const costPerNFT = Web3.utils.toWei('0.05', 'wei');
      const totalCost = Web3.utils.toWei((costPerNFT * mintAmount).toString(), 'ether');

      await contract.methods.mint(accounts[0], mintAmount).send({ from: accounts[0], value: totalCost });
      alert('Minting successful!');
      const imageUrls = [];
    for (let i = 0; i < mintAmount; i++) {
      const tokenId = await contract.methods.totalSupply().call();
      const metadataURI = await contract.methods.tokenURI(tokenId).call();
      
      // Convert metadata CID URI to a Pinata gateway URL
      const formattedMetadataURI = metadataURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');

      // Fetch metadata and extract image CID
      const response = await fetch(formattedMetadataURI);
      const metadata = await response.json();
      const imageCID = metadata.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');

      imageUrls.push(imageCID);
    }

    setNftImages(prevImages => [...prevImages, ...imageUrls]);
    } catch (error) {
      console.error("Minting failed!", error);
    }
  };


  return (
    <>
    <div className="App">
      <h1>Minting Machine App</h1>
      {isConnected ? (
        <>
          <p className="text">
            Your Wallet is connected{' '}
            <FontAwesomeIcon icon={faCircleCheck} style={{ color: '#63E6BE' }} />
          </p>

          <div className="button-container">
            <button onClick={promptForMintAmount} className="prompt-button">
              Set Mint Amount
            </button>
            <button onClick={mint} className="mint-button" disabled={isMinting}>
              {isMinting ? 'Minting...' : `Mint ${mintAmount} NFT(s)`}
            </button>
          </div>

            {/* Display minted NFT images */}
            <div className="nft-gallery">
              {nftImages.length > 0 ? (
                nftImages.map((url, index) => (
                  <img key={index} src={url} alt={`NFT ${index + 1}`} className="nft-image" />
                ))
              ) : (
                <p>No NFTs minted yet</p>
              )}
            </div>
        </>
      ) : (
        <button onClick={connectWallet} className="connect-button">
          Connect Wallet
        </button>
      )}
    </div>
    </>
  );
}

export default App
