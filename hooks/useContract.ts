import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import PULSE_MARKET_ABI from '@/lib/abi/PulseMarket.json';

// This will be populated after deployment
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

export function usePulseMarketContract() {
  return {
    address: CONTRACT_ADDRESS,
    abi: PULSE_MARKET_ABI,
  };
}

/**
 * Hook to create a new market
 */
export function useCreateMarket() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createMarket = async (question: string, description: string, duration: number) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: PULSE_MARKET_ABI,
      functionName: 'createMarket',
      args: [question, description, BigInt(duration)],
    });
  };

  return {
    createMarket,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}

/**
 * Hook to buy shares in a market
 */
export function useBuyShares() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const buyShares = async (marketId: number, isYes: boolean, shares: number, value: string) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: PULSE_MARKET_ABI,
      functionName: 'buyShares',
      args: [BigInt(marketId), isYes, BigInt(shares)],
      value: parseEther(value),
    });
  };

  return {
    buyShares,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}

/**
 * Hook to sell shares in a market
 */
export function useSellShares() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const sellShares = async (marketId: number, isYes: boolean, shares: number) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: PULSE_MARKET_ABI,
      functionName: 'sellShares',
      args: [BigInt(marketId), isYes, BigInt(shares)],
    });
  };

  return {
    sellShares,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}

/**
 * Hook to read market data from contract
 */
export function useMarket(marketId: number) {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: PULSE_MARKET_ABI,
    functionName: 'getMarket',
    args: [BigInt(marketId)],
  });

  return {
    market: data,
    isLoading,
    error,
  };
}

/**
 * Hook to read user position
 */
export function useUserPosition(marketId: number, userAddress: `0x${string}` | undefined) {
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: PULSE_MARKET_ABI,
    functionName: 'getUserPosition',
    args: userAddress ? [BigInt(marketId), userAddress] : undefined,
  });

  return {
    position: data,
    isLoading,
  };
}

/**
 * Hook to get market price
 */
export function useMarketPrice(marketId: number) {
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: PULSE_MARKET_ABI,
    functionName: 'getMarketPrice',
    args: [BigInt(marketId)],
  });

  return {
    price: data ? Number(data) : 50,
    isLoading,
  };
}

/**
 * Hook to calculate cost of buying shares
 */
export function useCalculateCost(marketId: number, isYes: boolean, shares: number) {
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: PULSE_MARKET_ABI,
    functionName: 'calculateCost',
    args: [BigInt(marketId), isYes, BigInt(shares)],
  });

  return {
    cost: data ? formatEther(data as bigint) : '0',
    isLoading,
  };
}

/**
 * Hook to resolve a market
 */
export function useResolveMarket() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const resolveMarket = async (marketId: number, outcome: boolean) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: PULSE_MARKET_ABI,
      functionName: 'resolveMarket',
      args: [BigInt(marketId), outcome],
    });
  };

  return {
    resolveMarket,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}

/**
 * Hook to claim winnings
 */
export function useClaimWinnings() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claimWinnings = async (marketId: number) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: PULSE_MARKET_ABI,
      functionName: 'claimWinnings',
      args: [BigInt(marketId)],
    });
  };

  return {
    claimWinnings,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}






