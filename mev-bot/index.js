import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
const wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);

async function mevResearchMonitor() {
  console.log('🔬 MEV RESEARCH: Local Mempool Monitor v2.0 ✅');
  console.log('💰 Wallet:', wallet.address);
  
  setInterval(async () => {
    try {
      // Get block number first (always works)
      const blockNumber = await provider.getBlockNumber();
      const latestBlock = await provider.getBlock(blockNumber);
      const balance = ethers.formatEther(await provider.getBalance(wallet.address));
      
      console.log(`📊 Block: ${blockNumber} | Gas: ${latestBlock.gasLimit.toString()} | 💵 Balance: ${balance} ETH`);
      console.log(`⏰ Time: ${new Date(latestBlock.timestamp * 1000).toLocaleTimeString()}`);
    } catch (error) {
      console.log('🔄 Monitor retrying...');
    }
  }, 3000);
}

mevResearchMonitor();















