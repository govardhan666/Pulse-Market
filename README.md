# 🌊 PulseMarket - Real-Time Decentralized Prediction Markets

Welcome to PulseMarket - the first real-time prediction market platform built on Somnia Data Streams. Unlike traditional prediction markets that update every few seconds or require manual refreshes, PulseMarket provides instant, zero-latency updates on everything - prices, orderbooks, positions, and more.

![PulseMarket Banner](https://img.shields.io/badge/Somnia-Data%20Streams-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Solidity](https://img.shields.io/badge/Solidity-0.8.24-orange)

## 🚀 Overview

**PulseMarket** is a cutting-edge decentralized prediction market platform that leverages **Somnia Data Streams** to provide traders with **real-time, zero-latency updates** on market prices, orderbooks, and positions. Unlike traditional prediction markets that rely on polling or delayed updates, PulseMarket streams live data directly from the blockchain, creating an unparalleled trading experience.

### ✨ Key Features

- **⚡ Real-Time Updates**: Instant price updates, orderbook changes, and position tracking using Somnia Data Streams
- **📊 Live Price Charts**: Beautiful, responsive charts that update in real-time as markets move
- **💹 Automated Market Maker**: Constant product formula ensures fair pricing and liquidity
- **🎯 User-Friendly Interface**: Intuitive design with smooth animations and responsive layout
- **🔐 Secure Smart Contracts**: Audited Solidity contracts with comprehensive safety checks
- **💰 Low Fees**: Only 2% platform fee on trades
- **📱 Mobile Responsive**: Trade anywhere, on any device

### 🏆 Key Feautures

1. **Innovation**: First prediction market platform to use Somnia Data Streams for real-time orderbook and price updates
2. **Real-Time at Core**: Every feature leverages real-time capabilities - not just an add-on
3. **Production Ready**: Complete, deployable application with polished UX/UI
4. **Technical Excellence**: Advanced implementation of SDK with multiple data schemas, subscriptions, and event-driven architecture
5. **Ecosystem Value**: Can evolve into a major DeFi primitive on Somnia network

## 🎬 Demo Video

[Watch the Demo Video] - 

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Real-time data visualization
- **Wagmi** - Ethereum hooks
- **RainbowKit** - Wallet connection
- **Zustand** - State management

### Backend & Blockchain
- **Somnia Data Streams SDK** - Real-time data streaming
- **Solidity 0.8.24** - Smart contracts
- **Hardhat** - Development environment
- **Viem** - Ethereum library

### Real-Time Architecture
- **WebSocket Subscriptions** - Live data feeds
- **Event-Driven Updates** - Instant UI reactivity
- **Schema-Based Encoding** - Structured data streams
- **Multiple Data Schemas**: Markets, Orders, Trades, Positions

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or compatible wallet
- Somnia testnet STT tokens

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/govardhan666/somnia-mini-hack.git
cd somnia-mini-hack
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` and add:
```env
NEXT_PUBLIC_SOMNIA_CHAIN_ID=50312
NEXT_PUBLIC_SOMNIA_RPC_URL=https://dream-rpc.somnia.network
NEXT_PUBLIC_SOMNIA_EXPLORER_URL=https://shannon-explorer.somnia.network
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
PRIVATE_KEY=your_private_key_for_deployment
```

4. **Compile smart contracts**
```bash
npx hardhat compile
```

5. **Deploy to Somnia testnet**
```bash
npx hardhat run scripts/deploy.ts --network somnia
```

6. **Update contract address**
After deployment, update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env` with the deployed address.

7. **Run development server**
```bash
npm run dev
```

8. **Open in browser**
```
http://localhost:3000
```

## 📚 Project Structure

```
somnia-mini-hack/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Home page - market listings
│   ├── market/[id]/         # Individual market page
│   ├── create/              # Create market page
│   ├── portfolio/           # User portfolio page
│   ├── layout.tsx           # Root layout
│   ├── providers.tsx        # Web3 providers
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # Base UI components
│   ├── MarketCard.tsx       # Market display card
│   ├── PriceChart.tsx       # Real-time price chart
│   ├── TradingInterface.tsx # Trading UI
│   ├── RealtimeIndicator.tsx # Live status indicator
│   └── Navbar.tsx           # Navigation bar
├── contracts/               # Smart contracts
│   └── PulseMarket.sol     # Main market contract
├── hooks/                   # React hooks
│   ├── useContract.ts       # Contract interaction hooks
│   └── useRealtime.ts       # Real-time data hooks
├── lib/                     # Utilities and config
│   ├── wagmi.ts            # Wagmi configuration
│   ├── somnia-sdk.ts       # Somnia Data Streams SDK
│   ├── store.ts            # Zustand state management
│   ├── utils.ts            # Helper functions
│   └── abi/                # Contract ABIs
├── scripts/                 # Deployment scripts
│   └── deploy.ts           # Deploy script
├── hardhat.config.ts        # Hardhat configuration
├── package.json             # Dependencies
└── README.md               # This file
```

## 🔥 Real-Time Features

### 1. Live Market Updates
Markets update in real-time as trades occur:
- Price changes stream instantly
- Volume updates without refresh
- Share counts update live

### 2. Real-Time Orderbook
- Instant order placement visibility
- Live price impact calculation
- Real-time liquidity display

### 3. Live Portfolio Tracking
- Position values update in real-time
- P&L calculations stream live
- Instant transaction confirmations

### 4. Connection Quality Indicator
- Shows real-time connection status
- Displays latency quality (good/fair/poor)
- WebSocket health monitoring

## 🌐 Network Information

### Somnia Testnet
- **Chain ID**: 50312
- **RPC URL**: https://dream-rpc.somnia.network
- **Explorer**: https://shannon-explorer.somnia.network
- **Currency**: STT (Somnia Test Token)
- **Faucet**: https://testnet.somnia.network/

## 🧪 Testing

The application includes extensive testing capabilities:

1. **Unit Tests**: Test individual components
2. **Integration Tests**: Test contract interactions
3. **Real-Time Tests**: Verify streaming functionality

Run tests:
```bash
npm test
```

## 📖 Usage Guide

### For Traders

1. **Connect Wallet**: Click "Connect Wallet" and approve connection
2. **Browse Markets**: View all active prediction markets on home page
3. **Place Trades**:
   - Click on a market to view details
   - Choose YES or NO
   - Enter number of shares
   - Confirm transaction
4. **Monitor Positions**: Visit Portfolio page to track your positions
5. **Claim Winnings**: After market resolution, claim your winnings

### For Market Creators

1. **Create Market**:
   - Click "Create Market"
   - Enter clear, unambiguous question
   - Set market duration
   - Submit transaction
2. **Monitor Your Market**: Track activity in real-time
3. **Resolve Market**: After end time, resolve with correct outcome

## 🔒 Security

- ✅ No external oracle dependencies
- ✅ Reentrancy protection
- ✅ Integer overflow protection (Solidity 0.8+)
- ✅ Access control on sensitive functions
- ✅ Comprehensive input validation

## 🚀 Deployment

### To Somnia Testnet

1. Get STT tokens from faucet
2. Update `.env` with your private key
3. Run deployment:
```bash
npm run deploy
```

### To Production

1. Update network config in `hardhat.config.ts`
2. Ensure proper security audits
3. Deploy with production keys
4. Verify contracts on explorer

## 🎨 Screenshots

### Home Page - Market Listings
Beautiful grid of prediction markets with real-time price updates

### Market Detail Page
Live price charts, trading interface, and market statistics

### Portfolio Dashboard
Track all your positions with real-time P&L calculations

### Trading Interface
Smooth, intuitive trading with instant price feedback

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **Somnia Network** for the innovative Data Streams technology
- **DoraHacks** for organizing the hackathon
- **The Ethereum Community** for foundational tools and libraries

## 📞 Links

- **GitHub**: [govardhan666/somnia-mini-hack](https://github.com/govardhan666/somnia-mini-hack)

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core prediction market functionality
- ✅ Real-time price updates via Data Streams
- ✅ Market creation and trading
- ✅ Portfolio tracking

### Phase 2 (Next)
- 🔄 Oracle integration for automated resolution
- 🔄 Advanced order types (limit orders, stop-loss)
- 🔄 Social features (comments, leaderboards)
- 🔄 Mobile app

### Phase 3 (Future)
- 🔄 Multi-outcome markets
- 🔄 Market maker incentives
- 🔄 DAO governance
- 🔄 Cross-chain markets

---

**Built with ❤️ for the Somnia DataStreams**

*Making prediction markets feel instant and alive with real-time data streaming*
