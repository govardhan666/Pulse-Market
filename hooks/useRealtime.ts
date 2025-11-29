import { useEffect, useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { initializeSomniaSDK, subscribeToMarket, subscribeToUserPosition, getSchemaIds } from '@/lib/somnia-sdk';
import { useMarketStore, useRealtimeStore } from '@/lib/store';

/**
 * Hook to subscribe to real-time market updates
 */
export function useMarketRealtime(marketId: number) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { updateMarket } = useMarketStore();
  const { setConnected, updateTimestamp } = useRealtimeStore();

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const subscribe = async () => {
      try {
        const sdk = await initializeSomniaSDK();

        unsubscribe = await subscribeToMarket(sdk, marketId, (data: any) => {
          // Update market data in real-time
          updateMarket(marketId, {
            totalYesShares: data.totalYesShares,
            totalNoShares: data.totalNoShares,
            totalVolume: data.totalVolume,
            currentPrice: data.currentPrice,
          });

          updateTimestamp();
          setConnected(true);
        });

        setIsSubscribed(true);
      } catch (error) {
        console.error('Error subscribing to market:', error);
        setConnected(false);
      }
    };

    subscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      setIsSubscribed(false);
    };
  }, [marketId, updateMarket, setConnected, updateTimestamp]);

  return { isSubscribed };
}

/**
 * Hook to subscribe to real-time position updates
 */
export function usePositionRealtime(marketId: number) {
  const { address } = useAccount();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { updatePosition } = useMarketStore();
  const { updateTimestamp } = useRealtimeStore();

  useEffect(() => {
    if (!address) return;

    let unsubscribe: (() => void) | null = null;

    const subscribe = async () => {
      try {
        const sdk = await initializeSomniaSDK();

        unsubscribe = await subscribeToUserPosition(sdk, marketId, address, (data: any) => {
          // Update position in real-time
          updatePosition(marketId, address, {
            marketId,
            yesShares: data.yesShares,
            noShares: data.noShares,
            invested: data.invested,
            currentValue: data.currentValue,
            pnl: data.pnl,
          });

          updateTimestamp();
        });

        setIsSubscribed(true);
      } catch (error) {
        console.error('Error subscribing to position:', error);
      }
    };

    subscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      setIsSubscribed(false);
    };
  }, [marketId, address, updatePosition, updateTimestamp]);

  return { isSubscribed };
}

/**
 * Hook to poll for updates when subscriptions aren't active
 */
export function useRealtimePolling(marketId: number, interval: number = 3000) {
  const { updateMarket } = useMarketStore();
  const [lastPoll, setLastPoll] = useState(Date.now());

  useEffect(() => {
    const pollData = async () => {
      try {
        const sdk = await initializeSomniaSDK();
        const schemaIds = await getSchemaIds(sdk);

        // Fetch latest market data
        // This would be replaced with actual data fetching logic
        setLastPoll(Date.now());
      } catch (error) {
        console.error('Error polling data:', error);
      }
    };

    const timer = setInterval(pollData, interval);

    return () => clearInterval(timer);
  }, [marketId, interval, updateMarket]);

  return { lastPoll };
}

/**
 * Hook to manage WebSocket connection status
 */
export function useRealtimeConnection() {
  const { isConnected, lastUpdate } = useRealtimeStore();
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'fair' | 'poor'>('good');

  useEffect(() => {
    const checkConnection = () => {
      const timeSinceUpdate = Date.now() - lastUpdate;

      if (timeSinceUpdate < 5000) {
        setConnectionQuality('good');
      } else if (timeSinceUpdate < 15000) {
        setConnectionQuality('fair');
      } else {
        setConnectionQuality('poor');
      }
    };

    const timer = setInterval(checkConnection, 1000);
    return () => clearInterval(timer);
  }, [lastUpdate]);

  return { isConnected, connectionQuality, lastUpdate };
}
