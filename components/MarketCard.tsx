'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardBody } from './ui/Card';
import { Badge } from './ui/Badge';
import { Market } from '@/lib/store';
import { formatTimeAgo, formatNumber, getPriceColor, getStatusColor } from '@/lib/utils';
import { TrendingUp, TrendingDown, Clock, DollarSign } from 'lucide-react';
import { useMarketRealtime } from '@/hooks/useRealtime';

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  useMarketRealtime(market.id); // Subscribe to real-time updates

  const yesPercentage = market.totalYesShares + market.totalNoShares > 0
    ? (market.totalYesShares / (market.totalYesShares + market.totalNoShares)) * 100
    : 50;

  const isEnding = market.endTime * 1000 - Date.now() < 24 * 60 * 60 * 1000;

  return (
    <Link href={`/market/${market.id}`}>
      <Card hoverable className="cursor-pointer">
        <CardBody>
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {market.question}
                </h3>
                {market.description && (
                  <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                    {market.description}
                  </p>
                )}
              </div>
              <Badge variant={market.status === 'Active' ? 'success' : 'default'}>
                {market.status}
              </Badge>
            </div>

            {/* Price Display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-success-50 border border-success-200">
                <div className="flex items-center justify-center gap-1 text-success-700 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-medium">YES</span>
                </div>
                <div className={cn('text-2xl font-bold', getPriceColor(yesPercentage))}>
                  {formatNumber(yesPercentage, 1)}%
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {formatNumber(market.totalYesShares)} shares
                </div>
              </div>

              <div className="text-center p-4 rounded-lg bg-danger-50 border border-danger-200">
                <div className="flex items-center justify-center gap-1 text-danger-700 mb-1">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-xs font-medium">NO</span>
                </div>
                <div className={cn('text-2xl font-bold', getPriceColor(100 - yesPercentage))}>
                  {formatNumber(100 - yesPercentage, 1)}%
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {formatNumber(market.totalNoShares)} shares
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span>{formatNumber(market.totalVolume / 1e18, 2)} STT volume</span>
              </div>
              <div className={cn(
                'flex items-center gap-1',
                isEnding ? 'text-danger-600' : 'text-gray-600'
              )}>
                <Clock className="h-4 w-4" />
                <span>{formatTimeAgo(market.endTime)}</span>
              </div>
            </div>

            {/* Live Indicator */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Created {formatTimeAgo(market.createdAt)}
              </span>
              <div className="flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
                </span>
                <span className="text-xs font-medium text-success-600">Live</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

// Import cn function
import { cn } from '@/lib/utils';
