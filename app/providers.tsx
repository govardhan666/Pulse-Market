'use client';

import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, injectedWallet } from '@rainbow-me/rainbowkit/wallets';
import { somniaTestnet } from '@/lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';
import { Toaster } from 'react-hot-toast';

// Create connectors without WalletConnect
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, injectedWallet],
    },
  ],
  {
    appName: 'PulseMarket',
    projectId: 'pulsemarket', // Not used since we're not using WalletConnect
  }
);

// Create config
const config = createConfig({
  connectors,
  chains: [somniaTestnet],
  transports: {
    [somniaTestnet.id]: http('https://dream-rpc.somnia.network'),
  },
  ssr: true,
});

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
          <Toaster position="bottom-right" />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
