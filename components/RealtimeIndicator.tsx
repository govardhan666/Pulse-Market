'use client';

import React from 'react';
import { useRealtimeConnection } from '@/hooks/useRealtime';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RealtimeIndicator() {
  const { isConnected, connectionQuality } = useRealtimeConnection();

  const qualityColors = {
    good: 'text-success-600',
    fair: 'text-yellow-600',
    poor: 'text-danger-600',
  };

  const qualityText = {
    good: 'Live',
    fair: 'Slow',
    poor: 'Disconnected',
  };

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <>
          <div className="relative">
            <Wifi className={cn('h-4 w-4', qualityColors[connectionQuality])} />
            <span className={cn(
              'absolute top-0 right-0 block h-2 w-2 rounded-full',
              connectionQuality === 'good' && 'bg-success-600 animate-pulse',
              connectionQuality === 'fair' && 'bg-yellow-600',
              connectionQuality === 'poor' && 'bg-danger-600'
            )} />
          </div>
          <span className={cn('text-sm font-medium', qualityColors[connectionQuality])}>
            {qualityText[connectionQuality]}
          </span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">Offline</span>
        </>
      )}
    </div>
  );
}
