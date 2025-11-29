import { create } from 'zustand';

export interface Market {
  id: number;
  question: string;
  description: string;
  creator: string;
  endTime: number;
  totalYesShares: number;
  totalNoShares: number;
  totalVolume: number;
  resolved: boolean;
  outcome: boolean;
  status: string;
  currentPrice: number;
  createdAt: number;
}

export interface Order {
  id: number;
  marketId: number;
  trader: string;
  isYes: boolean;
  shares: number;
  price: number;
  timestamp: number;
  status: string;
}

export interface Position {
  marketId: number;
  yesShares: number;
  noShares: number;
  invested: number;
  currentValue: number;
  pnl: number;
}

export interface Trade {
  marketId: number;
  trader: string;
  isYes: boolean;
  shares: number;
  price: number;
  timestamp: number;
  txHash: string;
}

interface MarketStore {
  markets: Map<number, Market>;
  orders: Map<number, Order>;
  trades: Trade[];
  positions: Map<string, Position>; // key: `${marketId}-${address}`

  // Actions
  addMarket: (market: Market) => void;
  updateMarket: (marketId: number, updates: Partial<Market>) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: number, updates: Partial<Order>) => void;
  addTrade: (trade: Trade) => void;
  updatePosition: (marketId: number, address: string, position: Position) => void;

  // Getters
  getMarket: (id: number) => Market | undefined;
  getMarketOrders: (marketId: number) => Order[];
  getMarketTrades: (marketId: number) => Trade[];
  getUserPosition: (marketId: number, address: string) => Position | undefined;
  getAllMarkets: () => Market[];
  getActiveMarkets: () => Market[];
}

export const useMarketStore = create<MarketStore>((set, get) => ({
  markets: new Map(),
  orders: new Map(),
  trades: [],
  positions: new Map(),

  addMarket: (market) => set((state) => {
    const markets = new Map(state.markets);
    markets.set(market.id, market);
    return { markets };
  }),

  updateMarket: (marketId, updates) => set((state) => {
    const markets = new Map(state.markets);
    const market = markets.get(marketId);
    if (market) {
      markets.set(marketId, { ...market, ...updates });
    }
    return { markets };
  }),

  addOrder: (order) => set((state) => {
    const orders = new Map(state.orders);
    orders.set(order.id, order);
    return { orders };
  }),

  updateOrder: (orderId, updates) => set((state) => {
    const orders = new Map(state.orders);
    const order = orders.get(orderId);
    if (order) {
      orders.set(orderId, { ...order, ...updates });
    }
    return { orders };
  }),

  addTrade: (trade) => set((state) => ({
    trades: [trade, ...state.trades].slice(0, 100), // Keep last 100 trades
  })),

  updatePosition: (marketId, address, position) => set((state) => {
    const positions = new Map(state.positions);
    positions.set(`${marketId}-${address}`, position);
    return { positions };
  }),

  getMarket: (id) => get().markets.get(id),

  getMarketOrders: (marketId) => {
    const orders = get().orders;
    return Array.from(orders.values()).filter(order => order.marketId === marketId);
  },

  getMarketTrades: (marketId) => {
    return get().trades.filter(trade => trade.marketId === marketId);
  },

  getUserPosition: (marketId, address) => {
    return get().positions.get(`${marketId}-${address}`);
  },

  getAllMarkets: () => {
    return Array.from(get().markets.values()).sort((a, b) => b.createdAt - a.createdAt);
  },

  getActiveMarkets: () => {
    return Array.from(get().markets.values())
      .filter(market => market.status === 'Active')
      .sort((a, b) => b.totalVolume - a.totalVolume);
  },
}));

// Real-time update store
interface RealtimeStore {
  lastUpdate: number;
  isConnected: boolean;
  setConnected: (connected: boolean) => void;
  updateTimestamp: () => void;
}

export const useRealtimeStore = create<RealtimeStore>((set) => ({
  lastUpdate: Date.now(),
  isConnected: false,

  setConnected: (connected) => set({ isConnected: connected }),

  updateTimestamp: () => set({ lastUpdate: Date.now() }),
}));
