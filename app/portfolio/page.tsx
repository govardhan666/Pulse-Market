'use client';

import React from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useMarketStore } from '@/lib/store';
import { formatNumber, formatAddress, calculatePnL } from '@/lib/utils';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function PortfolioPage() {
  const { address } = useAccount();
  const { getAllMarkets, positions } = useMarketStore();

  if (!address) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to view your portfolio and active positions
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  const allMarkets = getAllMarkets();
  const userPositions = Array.from(positions.entries())
    .filter(([key]) => key.endsWith(address))
    .map(([key, position]) => {
      const marketId = parseInt(key.split('-')[0]);
      const market = allMarkets.find(m => m.id === marketId);
      return market ? { market, position } : null;
    })
    .filter(Boolean);

  const totalInvested = userPositions.reduce((sum, item) => sum + (item?.position.invested || 0), 0);
  const totalValue = userPositions.reduce((sum, item) => sum + (item?.position.currentValue || 0), 0);
  const { pnl, pnlPercentage, isProfit } = calculatePnL(totalInvested, totalValue);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Your Portfolio
        </h1>
        <p className="text-lg text-gray-600">
          Track your positions and performance across all markets
        </p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Invested</span>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(totalInvested / 1e18, 4)} STT
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Current Value</span>
              <Wallet className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(totalValue / 1e18, 4)} STT
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total P&L</span>
              {isProfit ? (
                <TrendingUp className="h-4 w-4 text-success-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-danger-600" />
              )}
            </div>
            <div className={`text-2xl font-bold ${isProfit ? 'text-success-600' : 'text-danger-600'}`}>
              {isProfit ? '+' : ''}{formatNumber(pnl / 1e18, 4)} STT
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">P&L %</span>
            </div>
            <div className={`text-2xl font-bold ${isProfit ? 'text-success-600' : 'text-danger-600'}`}>
              {isProfit ? '+' : ''}{formatNumber(pnlPercentage, 2)}%
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Active Positions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Positions</h2>
        {userPositions.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No active positions</h3>
                <p className="text-gray-600 mb-6">
                  Start trading on prediction markets to build your portfolio
                </p>
                <Link href="/">
                  <Button>Browse Markets</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {userPositions.map((item) => {
              if (!item) return null;
              const { market, position } = item;
              const positionPnL = calculatePnL(position.invested, position.currentValue);

              return (
                <Card key={market.id} hoverable>
                  <CardBody>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Link href={`/market/${market.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 mb-2">
                            {market.question}
                          </h3>
                        </Link>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">YES Shares</span>
                            <div className="font-semibold text-success-600">
                              {formatNumber(position.yesShares)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">NO Shares</span>
                            <div className="font-semibold text-danger-600">
                              {formatNumber(position.noShares)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Invested</span>
                            <div className="font-semibold">
                              {formatNumber(position.invested / 1e18, 4)} STT
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Current Value</span>
                            <div className="font-semibold">
                              {formatNumber(position.currentValue / 1e18, 4)} STT
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">P&L</span>
                            <div className={`font-semibold ${positionPnL.isProfit ? 'text-success-600' : 'text-danger-600'}`}>
                              {positionPnL.isProfit ? '+' : ''}{formatNumber(positionPnL.pnl / 1e18, 4)} STT
                              <span className="text-xs ml-1">
                                ({positionPnL.isProfit ? '+' : ''}{formatNumber(positionPnL.pnlPercentage, 1)}%)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge className="whitespace-nowrap">
                        {market.status}
                      </Badge>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
