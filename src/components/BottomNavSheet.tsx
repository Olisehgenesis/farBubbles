"use client";

import { useState } from "react";
import ChainSelector, { Chain } from "./ChainSelector";

interface BottomNavSheetProps {
  selectedChain: Chain;
  onChainChange: (chain: Chain) => void;
  tokensCount: number;
  lastUpdated?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function BottomNavSheet({ 
  selectedChain, 
  onChainChange, 
  tokensCount, 
  lastUpdated, 
  onRefresh, 
  isLoading 
}: BottomNavSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-800/80 backdrop-blur-lg border-t border-purple-200/50 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and App Name */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold">🌌</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-purple-200">Orbital Caps</h1>
                <p className="text-xs text-purple-300">
                  {selectedChain === 'celo' ? `${tokensCount} planets` : 'Coming soon'}
                </p>
              </div>
            </div>

            {/* Chain Selector */}
            <ChainSelector
              selectedChain={selectedChain}
              onChainChange={onChainChange}
            />

            {/* Menu Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="w-10 h-10 bg-purple-500/20 hover:bg-purple-500/30 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
                  <div 
          className="absolute bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-lg rounded-t-3xl shadow-2xl border border-purple-200/50"
          style={{ maxHeight: '70vh' }}
        >
            {/* Handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1 bg-purple-300 rounded-full"></div>
            </div>

            {/* Content */}
            <div className="px-6 pb-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-purple-200">Orbital Caps</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-purple-100/20 hover:bg-purple-200/30 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Network Info */}
              <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">
                    {selectedChain === 'celo' ? '🌌' : selectedChain === 'base' ? '🔵' : selectedChain === 'monad' ? '🟣' : '🟡'}
                  </span>
                  <h3 className="font-semibold text-purple-200">
                    {selectedChain === 'celo' ? 'Celo Network' : `${selectedChain.charAt(0).toUpperCase() + selectedChain.slice(1)} Network`}
                  </h3>
                </div>
                <p className="text-sm text-purple-300">
                  {selectedChain === 'celo' ? (
                    <>
                      Explore {tokensCount} planets on the Celo network
                      {lastUpdated && (
                        <span className="block mt-1 text-xs text-purple-400">
                          Last updated: {lastUpdated}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-purple-300">
                      🚀 {selectedChain.charAt(0).toUpperCase() + selectedChain.slice(1)} support coming soon!
                    </span>
                  )}
                </p>
              </div>

              {/* Actions */}
              {selectedChain === 'celo' && onRefresh && (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      onRefresh();
                      setIsOpen(false);
                    }}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors disabled:opacity-50 shadow-lg hover:shadow-xl"
                  >
                    <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {isLoading ? 'Refreshing...' : 'Refresh Token List'}
                  </button>
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-purple-200/30">
                <p className="text-xs text-purple-300 text-center">
                  Data from{" "}
                  <a
                    href="https://github.com/Ubeswap/default-token-list"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-300 hover:text-purple-200 underline font-semibold"
                  >
                    Ubeswap Token List
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 