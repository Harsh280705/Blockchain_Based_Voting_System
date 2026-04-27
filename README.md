Blockchain Voting System

A secure and transparent voting application using React, Node.js, MySQL, and Blockchain (Solidity + Hardhat).

🚀 Features
- Secure login system  
- MetaMask wallet integration  
- Blockchain-based voting  
- Real-time results  

## 🛠️ Tech Stack
React • Node.js • Express • MySQL • Solidity • Hardhat • ethers.js  

⚙️ Setup

### Backend
cd "EXTERNAL VOTING"
npm install
npm start

### Frontend
cd "React-Voting-Application-main"
npm install
npm start

### Deploy Contract
npx hardhat run scripts/deploy.js --network volta

Update contract address in:
src/Constant/constant.js

⚠️ Note
Use .env for private keys and database credentials.
