import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('http://localhost:8545');

console.log('🚀 Transaction Generator Started');
console.log('Sending test transactions to Geth...\n');

// Create random wallets for testing
const wallet1 = ethers.Wallet.createRandom().connect(provider);
const wallet2 = ethers.Wallet.createRandom().connect(provider);
const wallet3 = ethers.Wallet.createRandom().connect(provider);

console.log('Created test wallets:');
console.log(`  Wallet 1: ${wallet1.address}`);
console.log(`  Wallet 2: ${wallet2.address}`);
console.log(`  Wallet 3: ${wallet3.address}\n`);

// Check if we can get the coinbase account (miner account with ETH)
let fundingAccount;

async function setupAccounts() {
    try {
        // Try to get accounts from Geth
        const accounts = await provider.send('eth_accounts', []);
        
        if (accounts.length === 0) {
            console.log('⚠️  No accounts found in Geth.');
            console.log('💡 To see real transaction flow, you need to:');
            console.log('   1. Either wait for mainnet sync (3-5 days)');
            console.log('   2. Or switch back to --dev mode for local testing');
            console.log('\nFor now, the MEV monitor is running and will show activity once Lighthouse syncs.\n');
            return false;
        }
        
        fundingAccount = accounts[0];
        console.log(`✅ Found funding account: ${fundingAccount}\n`);
        return true;
        
    } catch (error) {
        console.log('⚠️  Cannot access accounts:', error.message);
        return false;
    }
}

async function fundWallets() {
    if (!fundingAccount) return false;
    
    try {
        const signer = await provider.getSigner(fundingAccount);
        
        console.log('💰 Funding test wallets...');
        
        for (const wallet of [wallet1, wallet2, wallet3]) {
            const tx = await signer.sendTransaction({
                to: wallet.address,
                value: ethers.parseEther('10.0')
            });
            await tx.wait();
            console.log(`   ✅ Funded ${wallet.address.slice(0, 10)}... with 10 ETH`);
        }
        
        console.log('✅ All wallets funded!\n');
        return true;
        
    } catch (error) {
        console.log('❌ Error funding wallets:', error.message);
        return false;
    }
}

async function sendTransaction() {
    if (!fundingAccount) {
        console.log('⏳ Waiting for Geth to be ready with accounts...');
        return;
    }
    
    try {
        // Randomly pick sender and receiver
        const wallets = [wallet1, wallet2, wallet3];
        const sender = wallets[Math.floor(Math.random() * wallets.length)];
        const receiver = wallets[Math.floor(Math.random() * wallets.length)];
        
        if (sender.address === receiver.address) return;
        
        const amount = ethers.parseEther((Math.random() * 0.5).toFixed(4));
        
        console.log(`📤 ${sender.address.slice(0, 10)}... → ${receiver.address.slice(0, 10)}... (${ethers.formatEther(amount)} ETH)`);
        
        const tx = await sender.sendTransaction({
            to: receiver.address,
            value: amount,
            gasLimit: 21000
        });
        
        console.log(`   TX Hash: ${tx.hash.slice(0, 20)}...`);
        
        const receipt = await tx.wait();
        console.log(`   ✅ Mined in block ${receipt.blockNumber}\n`);
        
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}\n`);
    }
}

// Main execution
(async () => {
    const hasAccounts = await setupAccounts();
    
    if (hasAccounts) {
        await fundWallets();
        
        console.log('🔄 Starting to send transactions every 5 seconds...\n');
        setInterval(sendTransaction, 5000);
        sendTransaction();
    } else {
        console.log('📊 MEV Monitor is still running in Terminal 1.');
        console.log('It will show mainnet activity once Lighthouse finishes syncing (3-5 days).\n');
    }
})();