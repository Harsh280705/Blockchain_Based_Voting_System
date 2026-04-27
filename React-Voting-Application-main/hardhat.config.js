/**
* @type import('hardhat/config').HardhatUserConfig
*/

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { PRIVATE_KEY } = process.env;

module.exports = {
   solidity: "0.8.11",
   defaultNetwork: "volta",
   networks: {
      volta: {
         url: " https://volta-rpc.energyweb.org ",
         accounts: ['725658dc94ea5ff72eb07701d084aaa360108d876b3cf7231215b71094b2f4c1'],
         gas: 210000000,
         gasPrice: 800000000000,
      }
   }
};