'use client';

import React from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { RealtimeIndicator } from './RealtimeIndicator';
import { Activity, PlusCircle } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              PulseMarket
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Markets
            </Link>
            <Link
              href="/portfolio"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="/create"
              className="flex items-center gap-1 text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Create Market
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
