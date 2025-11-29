'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from './ui/Card';
import { Button } from './ui/Button';
import { useBuyShares, useCalculateCost } from '@/hooks/useContract';
import { formatNumber } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface TradingInterfaceProps {
  marketId: number;
  currentPrice: number;
}

export function TradingInterface({ marketId, currentPrice }: TradingInterfaceProps) {
  const [side, setSide] = useState<'yes' | 'no'>('yes');
  const [shares, setShares] = useState('100');
  const { buyShares, isPending, isConfirming } = useBuyShares();
  const { cost } = useCalculateCost(marketId, side === 'yes', parseInt(shares) || 0);

  const handleTrade = async () => {
    try {
      const sharesNum = parseInt(shares);
      if (isNaN(sharesNum) || sharesNum <= 0) {
        toast.error('Please enter a valid number of shares');
        return;
      }

      await buyShares(marketId, side === 'yes', sharesNum, cost);
      toast.success(`Successfully bought ${shares} ${side.toUpperCase()} shares!`);
      setShares('100');
    } catch (error) {
      toast.error('Transaction failed');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Trade</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {/* Side Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSide('yes')}
              className={cn(
                'p-4 rounded-lg border-2 transition-all',
                side === 'yes'
                  ? 'border-success-500 bg-success-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <div className="flex items-center justify-center gap-2 text-success-700 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="font-semibold">YES</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(currentPrice, 1)}%
              </div>
              <div className="text-xs text-gray-600 mt-1">Current price</div>
            </button>

            <button
              onClick={() => setSide('no')}
              className={cn(
                'p-4 rounded-lg border-2 transition-all',
                side === 'no'
                  ? 'border-danger-500 bg-danger-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <div className="flex items-center justify-center gap-2 text-danger-700 mb-2">
                <TrendingDown className="h-5 w-5" />
                <span className="font-semibold">NO</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(100 - currentPrice, 1)}%
              </div>
              <div className="text-xs text-gray-600 mt-1">Current price</div>
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Shares
            </label>
            <input
              type="number"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="100"
              min="1"
            />
          </div>

          {/* Cost Display */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Estimated Cost</span>
              <span className="text-lg font-bold text-gray-900">
                {formatNumber(parseFloat(cost), 4)} STT
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Shares</span>
              <span>{shares}</span>
            </div>
          </div>

          {/* Trade Button */}
          <Button
            onClick={handleTrade}
            variant={side === 'yes' ? 'success' : 'danger'}
            className="w-full"
            size="lg"
            isLoading={isPending || isConfirming}
          >
            {isPending || isConfirming
              ? 'Processing...'
              : `Buy ${side.toUpperCase()} Shares`}
          </Button>

          {/* Info */}
          <div className="text-xs text-gray-500 text-center">
            Prices update in real-time based on market activity
          </div>
        </div>
      </CardBody>
    </Card>
  );
}



