import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// Connect to your local Geth node
const provider = new ethers.JsonRpcProvider('http://localhost:8545');

console.log('🔍 MEV Monitor Started');
console.log('=' .repeat(80));

// Track mempool transactions
let pendingTxs = new Map();

// Monitor pending transactions
provider.on('pending', async (txHash) => {
    try {
        const tx = await provider.getTransaction(txHash);
        if (tx) {
            pendingTxs.set(txHash, {
                hash: txHash,
                from: tx.from,
                to: tx.to,
                value: ethers.formatEther(tx.value),
                gasPrice: ethers.formatUnits(tx.gasPrice, 'gwei'),
                timestamp: Date.now()
            });
            
            console.log(`\n📝 NEW PENDING TX: ${txHash.slice(0, 10)}...`);
            console.log(`   From: ${tx.from.slice(0, 10)}...`);
            console.log(`   To: ${tx.to ? tx.to.slice(0, 10) + '...' : 'Contract Creation'}`);
            console.log(`   Value: ${ethers.formatEther(tx.value)} ETH`);
            console.log(`   Gas Price: ${ethers.formatUnits(tx.gasPrice, 'gwei')} Gwei`);
        }
    } catch (error) {
        // Transaction might be mined already
    }
});

// Monitor new blocks
provider.on('block', async (blockNumber) => {
    try {
        const block = await provider.getBlock(blockNumber, true);
        
        console.log('\n' + '='.repeat(80));
        console.log(`🧱 NEW BLOCK #${blockNumber}`);
        console.log('='.repeat(80));
        console.log(`Timestamp: ${new Date(block.timestamp * 1000).toLocaleTimeString()}`);
        console.log(`Transactions: ${block.transactions.length}`);
        console.log(`Gas Used: ${block.gasUsed.toString()}`);
        console.log(`Gas Limit: ${block.gasLimit.toString()}`);
        console.log(`Base Fee: ${block.baseFeePerGas ? ethers.formatUnits(block.baseFeePerGas, 'gwei') + ' Gwei' : 'N/A'}`);
        
        // Analyze transaction ordering
        if (block.transactions.length > 0) {
            console.log('\n📊 TRANSACTION ORDERING ANALYSIS:');
            
            for (let i = 0; i < Math.min(block.transactions.length, 5); i++) {
                const tx = block.transactions[i];
                const receipt = await provider.getTransactionReceipt(tx.hash);
                
                console.log(`\n   TX #${i + 1}: ${tx.hash.slice(0, 10)}...`);
                console.log(`      From: ${tx.from.slice(0, 10)}...`);
                console.log(`      To: ${tx.to ? tx.to.slice(0, 10) + '...' : 'Contract Creation'}`);
                console.log(`      Value: ${ethers.formatEther(tx.value)} ETH`);
                console.log(`      Gas Price: ${ethers.formatUnits(tx.gasPrice || tx.maxFeePerGas, 'gwei')} Gwei`);
                console.log(`      Gas Used: ${receipt.gasUsed.toString()}`);
                console.log(`      Status: ${receipt.status === 1 ? '✅ Success' : '❌ Failed'}`);
            }
            
            if (block.transactions.length > 5) {
                console.log(`\n   ... and ${block.transactions.length - 5} more transactions`);
            }
        }
        
        // Check for potential MEV opportunities
        await detectMEVOpportunities(block);
        
        // Clear old pending transactions
        const now = Date.now();
        for (const [hash, data] of pendingTxs) {
            if (now - data.timestamp > 60000) { // 1 minute old
                pendingTxs.delete(hash);
            }
        }
        
        console.log(`\n📊 Mempool Size: ${pendingTxs.size} pending transactions`);
        
    } catch (error) {
        console.error('Error processing block:', error.message);
    }
});

// Detect potential MEV opportunities
async function detectMEVOpportunities(block) {
    if (block.transactions.length < 2) return;
    
    console.log('\n🎯 MEV OPPORTUNITY DETECTION:');
    
    // Check for potential sandwich attacks (same address before and after)
    const addresses = block.transactions.map(tx => tx.from);
    const addressCounts = {};
    
    for (const addr of addresses) {
        addressCounts[addr] = (addressCounts[addr] || 0) + 1;
    }
    
    for (const [addr, count] of Object.entries(addressCounts)) {
        if (count > 1) {
            console.log(`   ⚠️  Address ${addr.slice(0, 10)}... appears ${count} times (potential sandwich/MEV bot)`);
        }
    }
    
    // Check for high gas price transactions (potential front-running)
    const highGasTxs = block.transactions.filter(tx => {
        const gasPrice = tx.gasPrice || tx.maxFeePerGas;
        return gasPrice && parseFloat(ethers.formatUnits(gasPrice, 'gwei')) > 50;
    });
    
    if (highGasTxs.length > 0) {
        console.log(`   🔥 ${highGasTxs.length} high gas price transactions (>50 Gwei) - potential MEV activity`);
    }
}

// Display stats every 30 seconds
setInterval(() => {
    console.log('\n' + '─'.repeat(80));
    console.log(`📈 STATS - Mempool: ${pendingTxs.size} pending | Time: ${new Date().toLocaleTimeString()}`);
    console.log('─'.repeat(80));
}, 30000);

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 MEV Monitor stopped');
    process.exit(0);
});