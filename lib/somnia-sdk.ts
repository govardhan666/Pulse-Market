import { createPublicClient, createWalletClient, http, Account, toHex } from "viem";
import { somniaTestnet } from "./wagmi";

// Data schemas for Somnia Data Streams
export const marketSchema = `{
  "type": "object",
  "properties": {
    "marketId": { "type": "number" },
    "question": { "type": "string" },
    "creator": { "type": "string" },
    "endTime": { "type": "number" },
    "totalYesShares": { "type": "number" },
    "totalNoShares": { "type": "number" },
    "totalVolume": { "type": "number" },
    "status": { "type": "string" },
    "currentPrice": { "type": "number" },
    "timestamp": { "type": "number" }
  }
}`;

export const orderSchema = `{
  "type": "object",
  "properties": {
    "orderId": { "type": "number" },
    "marketId": { "type": "number" },
    "trader": { "type": "string" },
    "isYes": { "type": "boolean" },
    "shares": { "type": "number" },
    "price": { "type": "number" },
    "timestamp": { "type": "number" },
    "status": { "type": "string" }
  }
}`;

export const tradeSchema = `{
  "type": "object",
  "properties": {
    "marketId": { "type": "number" },
    "trader": { "type": "string" },
    "isYes": { "type": "boolean" },
    "shares": { "type": "number" },
    "price": { "type": "number" },
    "timestamp": { "type": "number" },
    "txHash": { "type": "string" }
  }
}`;

export const positionSchema = `{
  "type": "object",
  "properties": {
    "marketId": { "type": "number" },
    "user": { "type": "string" },
    "yesShares": { "type": "number" },
    "noShares": { "type": "number" },
    "invested": { "type": "number" },
    "currentValue": { "type": "number" },
    "pnl": { "type": "number" },
    "timestamp": { "type": "number" }
  }
}`;

// Mock SDK type for when the real SDK is not available
interface MockSDK {
  streams: {
    computeSchemaId: (schema: string) => Promise<string>;
    subscribe: (options: { id: string; onData: (data: any) => void }) => Promise<() => void>;
    set: (data: any[]) => Promise<void>;
    getByKey: (key: string) => Promise<any>;
  };
}

// Initialize SDK - returns mock if real SDK not available
export async function initializeSomniaSDK(account?: Account): Promise<MockSDK> {
  const publicClient = createPublicClient({
    chain: somniaTestnet,
    transport: http(),
  });

  // Return a mock SDK for now since @somnia-chain/streams may not be available
  // In production, replace this with actual SDK initialization
  const mockSDK: MockSDK = {
    streams: {
      computeSchemaId: async (schema: string) => {
        // Generate a deterministic ID from schema
        return toHex(schema.slice(0, 32), { size: 32 });
      },
      subscribe: async (options: { id: string; onData: (data: any) => void }) => {
        // Mock subscription - in production this would connect to real streams
        console.log(`Subscribed to stream: ${options.id}`);
        return () => {
          console.log(`Unsubscribed from stream: ${options.id}`);
        };
      },
      set: async (data: any[]) => {
        console.log('Publishing data to stream:', data);
      },
      getByKey: async (key: string) => {
        console.log('Getting data by key:', key);
        return null;
      },
    },
  };

  return mockSDK;
}

// Compute schema IDs
export async function getSchemaIds(sdk: MockSDK) {
  const marketSchemaId = await sdk.streams.computeSchemaId(marketSchema);
  const orderSchemaId = await sdk.streams.computeSchemaId(orderSchema);
  const tradeSchemaId = await sdk.streams.computeSchemaId(tradeSchema);
  const positionSchemaId = await sdk.streams.computeSchemaId(positionSchema);

  return {
    marketSchemaId,
    orderSchemaId,
    tradeSchemaId,
    positionSchemaId,
  };
}

// Helper to convert string to hex with padding
function stringToHex(str: string, size: number = 32): `0x${string}` {
  return toHex(str, { size }) as `0x${string}`;
}

// Publish market data to stream
export async function publishMarketData(
  sdk: MockSDK,
  schemaId: string,
  marketId: number,
  data: any
) {
  const streamId = stringToHex(`market-${marketId}`);

  await sdk.streams.set([
    {
      id: streamId,
      schemaId,
      data: JSON.stringify(data),
    },
  ]);

  return streamId;
}

// Publish order data to stream
export async function publishOrderData(
  sdk: MockSDK,
  schemaId: string,
  orderId: number,
  data: any
) {
  const streamId = stringToHex(`order-${orderId}`);

  await sdk.streams.set([
    {
      id: streamId,
      schemaId,
      data: JSON.stringify(data),
    },
  ]);

  return streamId;
}

// Publish trade data to stream
export async function publishTradeData(
  sdk: MockSDK,
  schemaId: string,
  marketId: number,
  data: any
) {
  const streamId = stringToHex(`trade-${marketId}-${Date.now()}`);

  await sdk.streams.set([
    {
      id: streamId,
      schemaId,
      data: JSON.stringify(data),
    },
  ]);

  return streamId;
}

// Publish position update to stream
export async function publishPositionData(
  sdk: MockSDK,
  schemaId: string,
  marketId: number,
  user: string,
  data: any
) {
  const streamId = stringToHex(`position-${marketId}-${user.slice(0, 8)}`);

  await sdk.streams.set([
    {
      id: streamId,
      schemaId,
      data: JSON.stringify(data),
    },
  ]);

  return streamId;
}

// Subscribe to market updates
export async function subscribeToMarket(
  sdk: MockSDK,
  marketId: number,
  onData: (data: any) => void
) {
  const streamId = stringToHex(`market-${marketId}`);

  const unsubscribe = await sdk.streams.subscribe({
    id: streamId,
    onData: (data) => {
      onData(data);
    },
  });

  return unsubscribe;
}

// Subscribe to orderbook updates
export async function subscribeToOrderbook(
  sdk: MockSDK,
  marketId: number,
  onData: (data: any) => void
) {
  const streamId = stringToHex(`orderbook-${marketId}`);

  const unsubscribe = await sdk.streams.subscribe({
    id: streamId,
    onData: (data) => {
      onData(data);
    },
  });

  return unsubscribe;
}

// Subscribe to user position updates
export async function subscribeToUserPosition(
  sdk: MockSDK,
  marketId: number,
  user: string,
  onData: (data: any) => void
) {
  const streamId = stringToHex(`position-${marketId}-${user.slice(0, 8)}`);

  const unsubscribe = await sdk.streams.subscribe({
    id: streamId,
    onData: (data) => {
      onData(data);
    },
  });

  return unsubscribe;
}

// Get market data
export async function getMarketData(sdk: MockSDK, marketId: number) {
  const streamId = stringToHex(`market-${marketId}`);

  try {
    const data = await sdk.streams.getByKey(streamId);
    return data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    return null;
  }
}






