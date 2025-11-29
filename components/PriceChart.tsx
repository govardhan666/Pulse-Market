'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardBody } from './ui/Card';
import { formatDate, formatPercentage } from '@/lib/utils';

interface PricePoint {
  timestamp: number;
  yesPrice: number;
  noPrice: number;
}

interface PriceChartProps {
  marketId: number;
  data?: PricePoint[];
}

export function PriceChart({ marketId }: PriceChartProps) {
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    // Only initialize once
    if (initialized.current) return;
    initialized.current = true;

    // Generate initial mock data
    const mockData: PricePoint[] = [];
    const now = Date.now();
    for (let i = 24; i >= 0; i--) {
      mockData.push({
        timestamp: now - i * 60 * 60 * 1000,
        yesPrice: 45 + Math.random() * 10,
        noPrice: 45 + Math.random() * 10,
      });
    }
    setPriceData(mockData);
  }, []);

  // Separate effect for interval updates
  useEffect(() => {
    if (priceData.length === 0) return;

    const interval = setInterval(() => {
      setPriceData(prev => {
        if (prev.length === 0) return prev;
        const lastPoint = prev[prev.length - 1];
        const newPoint: PricePoint = {
          timestamp: Date.now(),
          yesPrice: Math.max(0, Math.min(100, lastPoint.yesPrice + (Math.random() - 0.5) * 2)),
          noPrice: Math.max(0, Math.min(100, lastPoint.noPrice + (Math.random() - 0.5) * 2)),
        };
        return [...prev.slice(-100), newPoint];
      });
    }, 5000); // Update every 5 seconds (slower to avoid issues)

    return () => clearInterval(interval);
  }, [priceData.length > 0]); // Only depend on whether data exists

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">
            {formatDate(payload[0].payload.timestamp / 1000)}
          </p>
          <p className="text-sm font-medium text-green-600">
            YES: {formatPercentage(payload[0].value)}
          </p>
          <p className="text-sm font-medium text-red-600">
            NO: {formatPercentage(payload[1]?.value || 0)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (priceData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Market Price Chart</h3>
        </CardHeader>
        <CardBody>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Loading chart data...
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Market Price Chart</h3>
          <div className="flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-green-600">Live Updates</span>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={priceData}>
            <defs>
              <linearGradient id="colorYes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="yesPrice"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorYes)"
              name="YES"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="noPrice"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorNo)"
              name="NO"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">YES Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700">NO Price</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}