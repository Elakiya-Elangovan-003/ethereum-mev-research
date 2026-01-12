# ethereum-mev-research
Local Ethereum Node Architecture &amp; MEV Research (Geth + MEV-Boost + Docker)
# Ethereum MEV Research Lab

Local Ethereum nodes + MEV monitoring. Geth v1.16.7 + Hardhat + Docker.

## Live Setup
- Geth v1.16.7 (port 8546) ✅
- Hardhat (port 8545) ✅
- MEV Monitor (1000 ETH) ✅
- Docker container ✅

## Start
```bash
cd D:\Ethereum-MEV-Project
docker-compose up -d
cd mev-bot
node index.js
```
##result
Balance: 1000.0 ETH | Block: 1 | Gas: 11.5M
