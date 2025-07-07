"use client";

import { useState } from "react";
import { Token } from "~/types/tokens";
import { cn } from "~/lib/utils";
import Image from "next/image";
import TokenPriceChart from "./TokenPriceChart";

interface TokenListProps {
  tokens: Token[];
}

export default function TokenList({ tokens }: TokenListProps) {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [showPriceChart, setShowPriceChart] = useState(false);

  // Safety check to ensure providers are ready
  if (typeof window === 'undefined') {
    return null;
  }

  const handleTokenClick = (token: Token) => {
    setSelectedToken(token);
    setShowPriceChart(true);
  };

  const handleClosePriceChart = () => {
    setShowPriceChart(false);
    setSelectedToken(null);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tokens.map((token) => (
          <div
            key={token.address}
            onClick={() => handleTokenClick(token)}
            className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50 backdrop-blur-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform">
                {token.logoURI ? (
                  <Image
                    src={token.logoURI}
                    alt={token.symbol}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold text-purple-800">
                    {token.symbol.slice(0, 2)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-purple-800 group-hover:text-purple-900 transition-colors">
                  {token.name}
                </h3>
                <p className="text-sm text-purple-600">{token.symbol}</p>
                <p className="text-xs text-purple-500 font-mono">
                  {token.address.slice(0, 6)}...{token.address.slice(-4)}
                </p>
              </div>
              <div className="text-right">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-purple-200/30">
              <div className="flex justify-between items-center text-sm">
                <span className="text-purple-600">Chain ID</span>
                <span className="font-medium text-purple-800">{token.chainId}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-purple-600">Decimals</span>
                <span className="font-medium text-purple-800">{token.decimals}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Price Chart Modal */}
      {selectedToken && showPriceChart && (
        <TokenPriceChart
          token={selectedToken}
          onClose={handleClosePriceChart}
        />
      )}
    </div>
  );
} 