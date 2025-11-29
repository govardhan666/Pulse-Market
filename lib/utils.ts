import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${formatNumber(value, 1)}%`;
}

export function formatTimeAgo(timestamp: number): string {
  return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
}

export function formatDate(timestamp: number): string {
  return format(new Date(timestamp * 1000), "MMM dd, yyyy HH:mm");
}

export function calculatePnL(invested: number, currentValue: number): {
  pnl: number;
  pnlPercentage: number;
  isProfit: boolean;
} {
  const pnl = currentValue - invested;
  const pnlPercentage = invested > 0 ? (pnl / invested) * 100 : 0;
  const isProfit = pnl > 0;

  return { pnl, pnlPercentage, isProfit };
}

export function getPriceColor(price: number): string {
  if (price >= 75) return "text-green-600";
  if (price >= 50) return "text-yellow-600";
  if (price >= 25) return "text-orange-600";
  return "text-red-600";
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-500/20 text-green-700";
    case "closed":
      return "bg-gray-500/20 text-gray-700";
    case "resolved":
      return "bg-blue-500/20 text-blue-700";
    case "cancelled":
      return "bg-red-500/20 text-red-700";
    default:
      return "bg-gray-500/20 text-gray-700";
  }
}

export function calculateCurrentPrice(yesShares: number, noShares: number): number {
  const total = yesShares + noShares;
  if (total === 0) return 50;
  return (yesShares / total) * 100;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}