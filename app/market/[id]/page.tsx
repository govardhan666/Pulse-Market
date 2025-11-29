'use client';

import React from 'react';
import { useMarketStore } from '@/lib/store';
import { PriceChart } from '@/components/PriceChart';
import { TradingInterface } from '@/components/TradingInterface';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { formatTimeAgo, formatAddress, formatNumber, getStatusColor } from '@/lib/utils';
import { Clock, User, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useMarketRealtime, usePositionRealtime } from '@/hooks/useRealtime';
import { useAccount } from 'wagmi';

export default function MarketPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const marketId = parseInt(id);
  const { getMarket, getUserPosition } = useMarketStore();
  const { address } = useAccount();
  const market = getMarket(marketId);

  useMarketRealtime(marketId);
  usePositionRealtime(marketId);


  if (!market) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Market Not Found</h2>
          <p className="text-gray-600">This market does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const position = address ? getUserPosition(marketId, address) : undefined;
  const yesPercentage = market.currentPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Market Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {market.question}
            </h1>
            {market.description && (
              <p className="text-lg text-gray-600">{market.description}</p>
            )}
          </div>
          <Badge className={getStatusColor(market.status)}>{market.status}</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Created by {formatAddress(market.creator)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Ends {formatTimeAgo(market.endTime)}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>{formatNumber(market.totalVolume / 1e18, 2)} STT volume</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Chart and Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Chart */}
          <PriceChart marketId={marketId} />

          {/* Market Stats */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Market Statistics</h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total YES Shares</div>
                  <div className="text-2xl font-bold text-success-600">
                    {formatNumber(market.totalYesShares)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total NO Shares</div>
                  <div className="text-2xl font-bold text-danger-600">
                    {formatNumber(market.totalNoShares)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Volume</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatNumber(market.totalVolume / 1e18, 2)} STT
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Market Created</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatTimeAgo(market.createdAt)}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Your Position */}
          {position && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Your Position</h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">YES Shares</div>
                    <div className="text-xl font-bold text-success-600">
                      {formatNumber(position.yesShares)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">NO Shares</div>
                    <div className="text-xl font-bold text-danger-600">
                      {formatNumber(position.noShares)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Total Invested</div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatNumber(position.invested / 1e18, 4)} STT
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Right Column - Trading Interface */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <TradingInterface marketId={marketId} currentPrice={yesPercentage} />
          </div>
        </div>
      </div>
    </div>
  );
}
