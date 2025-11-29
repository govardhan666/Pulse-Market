'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { MarketCard } from '@/components/MarketCard';
import { useMarketStore, Market } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Plus, TrendingUp, Activity, DollarSign, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { createPublicClient, http, parseAbi } from 'viem';
import { somniaTestnet } from '@/lib/wagmi';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

// Create a public client for reading contract data
const publicClient = createPublicClient({
  chain: somniaTestnet,
  transport: http(),
});

// ABI for reading markets
const marketAbi = parseAbi([
  'function marketCounter() view returns (uint256)',
  'function getMarket(uint256 marketId) view returns ((uint256 id, string question, string description, address creator, uint256 endTime, uint256 resolutionTime, uint256 totalYesShares, uint256 totalNoShares, uint256 totalVolume, bool resolved, bool outcome, uint256 createdAt, uint8 status))',
  'function getMarketPrice(uint256 marketId) view returns (uint256)',
]);

export default function HomePage() {
  const { markets, addMarket, getAllMarkets } = useMarketStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkets = useCallback(async () => {
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      setError('Contract not deployed. Please deploy the contract first.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get total number of markets
      const marketCount = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: marketAbi,
        functionName: 'marketCounter',
      });

      const count = Number(marketCount);
      console.log(`Found ${count} markets on chain`);

      if (count === 0) {
        setLoading(false);
        return;
      }

      // Fetch each market
      for (let i = 0; i < count; i++) {
        try {
          const marketData = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: marketAbi,
            functionName: 'getMarket',
            args: [BigInt(i)],
          }) as any;

          const price = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: marketAbi,
            functionName: 'getMarketPrice',
            args: [BigInt(i)],
          });

          const statusMap: { [key: number]: string } = {
            0: 'Active',
            1: 'Closed',
            2: 'Resolved',
            3: 'Cancelled',
          };

          const market: Market = {
            id: Number(marketData.id),
            question: marketData.question,
            description: marketData.description,
            creator: marketData.creator,
            endTime: Number(marketData.endTime),
            totalYesShares: Number(marketData.totalYesShares),
            totalNoShares: Number(marketData.totalNoShares),
            totalVolume: Number(marketData.totalVolume),
            resolved: marketData.resolved,
            outcome: marketData.outcome,
            status: statusMap[marketData.status] || 'Active',
            currentPrice: Number(price),
            createdAt: Number(marketData.createdAt),
          };

          addMarket(market);
        } catch (err) {
          console.error(`Error fetching market ${i}:`, err);
        }
      }
    } catch (err) {
      console.error('Error fetching markets:', err);
      setError('Failed to fetch markets. Make sure the contract is deployed.');
    }

    setLoading(false);
  }, [addMarket]);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  const allMarkets = getAllMarkets();
  const totalVolume = allMarkets.reduce((sum, m) => sum + m.totalVolume, 0);
  const activeMarkets = allMarkets.filter(m => m.status === 'Active').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Real-Time Prediction Markets
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Trade on the future with instant real-time updates powered by Somnia Data Streams.
          Zero latency, maximum transparency.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/create">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Create Market
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="secondary" 
            className="gap-2"
            onClick={fetchMarkets}
            disabled={loading}
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
          {error}
        </div>
      )}

      {/* Contract Address Info */}
      {CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000' && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 text-center">
          Contract: <code className="bg-blue-100 px-2 py-1 rounded">{CONTRACT_ADDRESS}</code>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Active Markets</span>
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{activeMarkets}</div>
          <div className="text-sm text-gray-500 mt-1">Live & trading</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Volume</span>
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {(totalVolume / 1e18).toFixed(4)} STT
          </div>
          <div className="text-sm text-gray-500 mt-1">All-time trading volume</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Real-Time Updates</span>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-3xl font-bold text-gray-900">Live</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">Powered by Somnia Data Streams</div>
        </div>
      </div>

      {/* Markets Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Markets</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading markets from blockchain...</p>
          </div>
        ) : allMarkets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No markets yet</h3>
            <p className="text-gray-600 mb-6">
              Be the first to create a prediction market on Somnia!
            </p>
            <Link href="/create">
              <Button>Create the first market</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {allMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
