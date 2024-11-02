import Web3 from 'web3';
import mintContract from './contracts/steve.json'; // Import the JSON file of your contract

const nftContract = web3 => {
    return new web3.eth.Contract(
        mintContract,  
        // "0xA9aae2CDae58fef266991eD3fFaB7F6C7eDC6A18"
        // "0xd37FCC24689BFDd0722A580AA49EF76BaAaF13E0"
        // "0x938fC3B6DA9801D01bA292eA1784Da79113ce4e6"
        // "0x9dAD810113F426fdC6cc179cDAa251e8481816d9"
        // "0x559a5Ef7dc146F2Af6fdcde72f5c3e0dF02772DC" #working
        "0x3D5753485f94e95149d22c3D661eF3C0967C1B3C"
    )
}


export default nftContract
