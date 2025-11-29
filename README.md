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

## 💹 Website Link
Link - https://pulse-market-somnia.vercel.app/

## 🎬 Demo Video
[Watch the Demo Video] - https://youtu.be/5l28WGr2ubY

## 🔐 Contract Address
Link - https://shannon-explorer.somnia.network/address/0xd6f65788e218db8cddf88697a4b0edf2c492ce2f

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

  ### Data Streaming Architecture

```typescript
// Market Data Schema
{
  marketId: number
  question: string
  totalYesShares: number
  totalNoShares: number
  currentPrice: number
  timestamp: number
}

// Real-Time Subscription
await sdk.streams.subscribe({
  id: marketStreamId,
  onData: (data) => {
    // UI updates instantly
    updateMarketPrice(data.currentPrice);
  }
});
```

### Smart Contract Functions

- `createMarket()` - Create new prediction market
- `buyShares()` - Purchase YES or NO shares
- `sellShares()` - Sell shares back to market
- `resolveMarket()` - Resolve market outcome
- `claimWinnings()` - Claim profits from resolved markets
- `calculateCost()` - Get real-time price quote

  ## 🎯 How It Works

### Market Creation
1. Users create prediction markets with binary outcomes (YES/NO)
2. Markets have defined end times and resolution criteria
3. Creator is responsible for resolving the market

### Trading Mechanism
- **Automated Market Maker (AMM)**: Uses constant product formula (x * y = k)
- **Dynamic Pricing**: Prices adjust based on supply/demand
- **Instant Settlement**: All trades execute on-chain immediately
- **Real-Time Updates**: Prices and positions update via Somnia Data Streams

  ## 🎨 Screenshots

### Home Page - Market Listings
<img width="1903" height="887" alt="image" src="https://github.com/user-attachments/assets/1d6f45e3-67db-41df-914c-00103971873c" />


### Market Detail Page
<img width="1918" height="875" alt="image" src="https://github.com/user-attachments/assets/4b1a12a4-1085-453b-b92f-57eeb8abef09" />


### Portfolio Dashboard
<img width="1916" height="882" alt="image" src="https://github.com/user-attachments/assets/ba7fe002-5b7d-4ab4-8d43-810cfe2bf18b" />


### Trading Interface
<img width="1918" height="885" alt="image" src="https://github.com/user-attachments/assets/9198d274-a80f-459b-b20d-8ace24ebab7c" />


# How We Use the Somnia Data Streams SDK

PulseMarket is built from the ground up around the `@somnia-chain/streams` SDK. This integration enables us to broadcast every trade, price movement, and portfolio change instantly to all connected users, transforming a traditional blockchain application into a real-time trading experience.

---

### 1. Defining Our Prediction Market Data Structures

Every piece of data that flows through PulseMarket follows a strict schema. This ensures consistency across our platform and allows any third-party application to easily consume our market data streams.

```typescript
// file: lib/somnia-sdk.ts

// Broadcasts updated market state after every trade execution
export const MARKET_PRICE_SCHEMA = `uint256 marketId, string question, address creator, uint256 endTime, uint256 totalYesShares, uint256 totalNoShares, uint256 totalVolume, uint8 status, uint256 currentPrice, uint256 timestamp`;

// Captures individual buy/sell transactions for live activity feeds
export const TRADE_EXECUTED_SCHEMA = `uint256 marketId, address trader, bool isYes, uint256 shares, uint256 price, uint256 cost, uint256 timestamp, bytes32 txHash`;

// Tracks user holdings for real-time portfolio valuation
export const USER_POSITION_SCHEMA = `uint256 marketId, address user, uint256 yesShares, uint256 noShares, uint256 totalInvested, uint256 currentValue, int256 profitLoss, uint256 timestamp`;

// Streams market resolution outcomes when creators settle markets
export const MARKET_RESOLVED_SCHEMA = `uint256 marketId, bool outcome, uint256 winningPool, uint256 losingPool, address resolver, uint256 timestamp`;
```

---

### 2. Broadcasting Price Updates After Every Trade

Whenever a user buys or sells shares on PulseMarket, our system instantly broadcasts the new market price to all subscribers. We encode the updated market state using `SchemaEncoder` and push it through Somnia Data Streams using `sdk.streams.set()`.

```typescript
// file: lib/somnia-sdk.ts

import { SDK, SchemaEncoder } from "@somnia-chain/streams";
import { toHex } from "viem";
import { MARKET_PRICE_SCHEMA, TRADE_EXECUTED_SCHEMA } from "./schemas";

const marketPriceEncoder = new SchemaEncoder(MARKET_PRICE_SCHEMA);
const tradeEncoder = new SchemaEncoder(TRADE_EXECUTED_SCHEMA);

// Called after every successful buyShares() or sellShares() transaction
export async function broadcastMarketPrice(sdk: SDK, marketId: number, market: MarketState) {
  const encoded = marketPriceEncoder.encodeData([
    { name: "marketId", value: marketId, type: "uint256" },
    { name: "question", value: market.question, type: "string" },
    { name: "creator", value: market.creator, type: "address" },
    { name: "endTime", value: market.endTime, type: "uint256" },
    { name: "totalYesShares", value: market.totalYesShares, type: "uint256" },
    { name: "totalNoShares", value: market.totalNoShares, type: "uint256" },
    { name: "totalVolume", value: market.totalVolume, type: "uint256" },
    { name: "status", value: market.status, type: "uint8" },
    { name: "currentPrice", value: market.currentPrice, type: "uint256" },
    { name: "timestamp", value: Date.now(), type: "uint256" },
  ]);

  const streamKey = toHex(`pulsemarket_${marketId}`, { size: 32 });
  const schemaId = await sdk.streams.computeSchemaId(MARKET_PRICE_SCHEMA);

  const txHash = await sdk.streams.set([{
    id: streamKey,
    schemaId: schemaId,
    data: encoded,
  }]);

  return txHash;
}

// Publishes trade details for live activity feeds and trade history
export async function broadcastTradeExecution(sdk: SDK, marketId: number, trade: TradeDetails) {
  const encoded = tradeEncoder.encodeData([
    { name: "marketId", value: marketId, type: "uint256" },
    { name: "trader", value: trade.trader, type: "address" },
    { name: "isYes", value: trade.isYes, type: "bool" },
    { name: "shares", value: trade.shares, type: "uint256" },
    { name: "price", value: trade.executionPrice, type: "uint256" },
    { name: "cost", value: trade.totalCost, type: "uint256" },
    { name: "timestamp", value: Date.now(), type: "uint256" },
    { name: "txHash", value: trade.txHash, type: "bytes32" },
  ]);

  const streamKey = toHex(`pulsemarket_trade_${marketId}_${Date.now()}`, { size: 32 });
  const schemaId = await sdk.streams.computeSchemaId(TRADE_EXECUTED_SCHEMA);

  const txHash = await sdk.streams.set([{
    id: streamKey,
    schemaId: schemaId,
    data: encoded,
  }]);

  return txHash;
}
```

---

### 3. Real-Time Market Subscriptions in React

Our frontend components subscribe to live market streams using custom React hooks. When any user trades on a market, every other user viewing that market sees the price update instantly without refreshing.

```typescript
// file: hooks/useRealtime.ts

import { useEffect } from "react";
import { SDK } from "@somnia-chain/streams";
import { useMarketStore } from "@/lib/store";
import { publicClient } from "@/lib/wagmi";
import { MARKET_PRICE_SCHEMA, TRADE_EXECUTED_SCHEMA } from "@/lib/somnia-sdk";

// Subscribes to live price updates for a specific prediction market
export function useMarketRealtime(marketId: number) {
  const { updateMarket } = useMarketStore();

  useEffect(() => {
    const sdk = new SDK({ public: publicClient });
    const schemaId = sdk.streams.computeSchemaId(MARKET_PRICE_SCHEMA);

    const subscription = sdk.streams.subscribe(
      { 
        schemaId: schemaId,
        filter: { marketId: marketId }
      },
      (payload) => {
        // SDK automatically decodes based on registered schema
        const marketData = payload.decodedData;

        // Update Zustand store, triggering React re-renders
        updateMarket(marketId, {
          totalYesShares: marketData.totalYesShares,
          totalNoShares: marketData.totalNoShares,
          totalVolume: marketData.totalVolume,
          currentPrice: marketData.currentPrice,
        });
      }
    );

    return () => subscription.unsubscribe();
  }, [marketId, updateMarket]);
}

// Subscribes to trade activity for live trade feed display
export function useTradeActivityStream(marketId: number, onTradeReceived: (trade: TradeDetails) => void) {
  useEffect(() => {
    const sdk = new SDK({ public: publicClient });
    const schemaId = sdk.streams.computeSchemaId(TRADE_EXECUTED_SCHEMA);

    const subscription = sdk.streams.subscribe(
      {
        schemaId: schemaId,
        filter: { marketId: marketId }
      },
      (payload) => {
        const trade = payload.decodedData;
        onTradeReceived({
          trader: trade.trader,
          isYes: trade.isYes,
          shares: trade.shares,
          price: trade.price,
          timestamp: trade.timestamp,
        });
      }
    );

    return () => subscription.unsubscribe();
  }, [marketId, onTradeReceived]);
}
```

---

### 4. Live Portfolio Tracking with Position Streams

Users can watch their portfolio value change in real-time as market prices move. We subscribe to position streams filtered by the user's wallet address, updating profit/loss calculations instantly.

```typescript
// file: hooks/useRealtime.ts

import { USER_POSITION_SCHEMA } from "@/lib/somnia-sdk";

// Subscribes to real-time position updates for portfolio page
export function usePositionRealtime(marketId: number, userAddress: string) {
  const { updateUserPosition } = useMarketStore();

  useEffect(() => {
    if (!userAddress) return;

    const sdk = new SDK({ public: publicClient });
    const schemaId = sdk.streams.computeSchemaId(USER_POSITION_SCHEMA);

    const subscription = sdk.streams.subscribe(
      {
        schemaId: schemaId,
        filter: { marketId: marketId, user: userAddress }
      },
      (payload) => {
        const position = payload.decodedData;

        updateUserPosition(marketId, userAddress, {
          yesShares: position.yesShares,
          noShares: position.noShares,
          invested: position.totalInvested,
          currentValue: position.currentValue,
          pnl: position.profitLoss,
        });
      }
    );

    return () => subscription.unsubscribe();
  }, [marketId, userAddress, updateUserPosition]);
}
```

---

### 5. Powering Live Price Charts

Our price charts subscribe directly to the trade stream, adding new data points as trades occur. This creates smooth, animated charts that visualize market sentiment in real-time.

```typescript
// file: components/PriceChart.tsx

import { useState, useEffect } from "react";
import { SDK } from "@somnia-chain/streams";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { TRADE_EXECUTED_SCHEMA } from "@/lib/somnia-sdk";

export function PriceChart({ marketId }: { marketId: number }) {
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);

  useEffect(() => {
    const sdk = new SDK({ public: publicClient });
    const schemaId = sdk.streams.computeSchemaId(TRADE_EXECUTED_SCHEMA);

    // Subscribe to all trades on this market
    const subscription = sdk.streams.subscribe(
      { schemaId, filter: { marketId } },
      (payload) => {
        const trade = payload.decodedData;

        // Append new price point, keeping last 100 for performance
        setPriceHistory(prev => [
          ...prev.slice(-100),
          {
            timestamp: trade.timestamp,
            yesPrice: trade.price,
            noPrice: 100 - trade.price,
          }
        ]);
      }
    );

    return () => subscription.unsubscribe();
  }, [marketId]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={priceHistory}>
        <XAxis dataKey="timestamp" />
        <YAxis domain={[0, 100]} />
        <Area type="monotone" dataKey="yesPrice" stroke="#10b981" fill="#10b98133" name="YES" />
        <Area type="monotone" dataKey="noPrice" stroke="#ef4444" fill="#ef444433" name="NO" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

---

The `@somnia-chain/streams` SDK is the backbone of PulseMarket's real-time experience: This architecture transforms PulseMarket from a traditional blockchain application into a live trading platform where every user sees synchronized, real-time data.

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
