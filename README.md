# Ethereum Node Architecture & MEV Research

A comprehensive implementation of Ethereum node infrastructure with MEV-Boost integration for studying Proposer-Builder Separation (PBS) and MEV dynamics.

## 🎯 Project Overview

This project demonstrates a complete Ethereum node setup with:
- **Execution Layer**: Geth (Go Ethereum)
- **Consensus Layer**: Lighthouse 
- **MEV Infrastructure**: MEV-Boost connected to Flashbots relay
- **Analysis Tools**: Real-time mempool monitoring and transaction ordering analysis

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────┐
│  Transaction Flow & MEV Observation             │
├─────────────────────────────────────────────────┤
│  User Transactions                              │
│         ↓                                       │
│  Mempool (Monitored)                            │
│         ↓                                       │
│  Builders (via Flashbots Relay)                 │
│         ↓                                       │
│  MEV-Boost (Middleware)                         │
│         ↓                                       │
│  Lighthouse (Consensus)                         │
│         ↓                                       │
│  Geth (Execution)                               │
│         ↓                                       │
│  Block Finalization                             │
└─────────────────────────────────────────────────┘
```

## ✨ Features

- ✅ Full Ethereum node setup (Geth + Lighthouse)
- ✅ MEV-Boost integration with Flashbots relay
- ✅ JWT authentication for Engine API
- ✅ Real-time mempool monitoring
- ✅ Transaction ordering analysis
- ✅ MEV opportunity detection
- ✅ Dual environment setup (production mainnet + development)

## 🚀 Quick Start

### Prerequisites

- Docker Desktop
- Node.js (v18+)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Elakiya-Elangovan-003/ethereum-mev-research.git
cd ethereum-mev-research
```

2. **Install Node.js dependencies**
```bash
npm install
```

3. **Start development environment**
```bash
docker-compose -f docker-compose-dev.yml up -d
```

4. **Monitor MEV activity** (Terminal 1)
```bash
node mev-monitor.js
```

5. **Generate test transactions** (Terminal 2)
```bash
node send-transactions.js
```

## 📊 What You'll Observe

- **Pending Transactions**: See transactions entering the mempool
- **Block Construction**: Observe blocks being created every 2 seconds
- **Transaction Ordering**: Analyze how transactions are prioritized
- **MEV Patterns**: Detect potential sandwich attacks and arbitrage opportunities
- **Gas Dynamics**: Monitor gas price variations and their impact

## 🔧 Configuration Files

### Development Environment (`docker-compose-dev.yml`)
- Geth in dev mode with pre-funded accounts
- 2-second block time
- Ideal for testing and demonstration

### Production Environment (`docker-compose.yml`)
- Geth + Lighthouse connected to mainnet
- MEV-Boost with Flashbots relay
- Real-world MEV observation

## 📁 Project Structure
```
ethereum-mev-research/
├── docker-compose.yml              # Production setup (mainnet)
├── docker-compose-dev.yml          # Development setup (local testing)
├── mev-monitor.js                  # MEV monitoring script
├── send-transactions.js            # Transaction generator
├── package.json                    # Node.js dependencies
├── jwtsecret                       # JWT token for Engine API
├── screenshots/                    # Project demonstrations
└── README.md                       # This file
```

## 🎓 Key Learnings

### Proposer-Builder Separation (PBS)
- Validators (proposers) don't build blocks themselves
- Specialized builders compete to create optimal blocks
- MEV-Boost acts as middleware connecting validators to builders

### MEV Dynamics
- Transaction ordering significantly impacts value extraction
- Gas price affects transaction priority
- Repeated addresses in blocks indicate potential MEV bot activity

### Technical Implementation
- Engine API enables execution-consensus layer communication
- JWT authentication secures the connection
- Docker containerization simplifies multi-component orchestration

## 🔬 Research Applications

This setup enables study of:
- MEV extraction strategies (sandwich attacks, arbitrage, liquidations)
- Builder competition dynamics
- Transaction ordering mechanisms
- Gas price impact on inclusion
- DeFi protocol interactions

## 📸 Screenshots

### MEV Monitor in Action
![MEV Monitoring](screenshots/mev-monitor-demo.png)

*Real-time monitoring of blocks, transactions, and MEV patterns*

### Docker Containers Running
![Docker Setup](screenshots/docker-containers.png)

*Geth development environment running in Docker*

### Project Structure
![Project Files](screenshots/project-structure.png)

*Complete project file structure*

## 🛠️ Technologies Used

- **Geth** (v1.13.15) - Ethereum execution client
- **Lighthouse** (v8.0.1) - Ethereum consensus client
- **MEV-Boost** (v1.10.1) - PBS middleware
- **Docker** - Containerization
- **Node.js** - Monitoring scripts
- **Ethers.js** - Ethereum interaction library

## 📝 Technical Details

### Engine API Connection
- Port 8551 (authenticated RPC)
- JWT-based authentication
- Enables consensus-execution layer communication

### MEV-Boost Integration
- Port 18550 (builder API)
- Connected to Flashbots relay
- Facilitates PBS architecture

## 🎯 Use Cases

1. **Educational**: Understanding Ethereum architecture and MEV
2. **Research**: Analyzing MEV patterns and strategies
3. **Development**: Testing MEV-aware applications
4. **Portfolio**: Demonstrating blockchain infrastructure skills

## 🤝 Contributing

This is a personal research project. Feel free to fork and adapt for your own learning!

## 📧 Contact

**Elakiya E**
- Email: elakiyaelangovan45@gmail.com
- GitHub: [@Elakiya-Elangovan-003](https://github.com/Elakiya-Elangovan-003)

## 📜 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- Ethereum Foundation for client documentation
- Flashbots for MEV-Boost and relay infrastructure
- Anthropic's Claude for development assistance

---

*Built as part of blockchain infrastructure learning and MEV research.*
