"use client";

import { Token, TokenList as TokenListType } from "~/types/tokens";
import TokenList from "~/components/TokenList";
import { useEffect, useState } from "react";
import Link from "next/link";

// Ubeswap token list URL
const UBESWAP_TOKEN_LIST_URL = "https://raw.githubusercontent.com/Ubeswap/default-token-list/master/ubeswap.token-list.json";

export default function TokensPage() {
  const [isClient, setIsClient] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch(UBESWAP_TOKEN_LIST_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch token list: ${response.status}`);
      }
      
      const tokenList: TokenListType = await response.json();
      setTokens(tokenList.tokens);
    } catch (err) {
      console.error('Error fetching token list:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tokens');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchTokens();
  }, []);

  if (!isClient || isLoading) {
    return (
      <div className="orbital-verse min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="stellar-loader w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orbital-verse min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-800 text-lg mb-2 font-medium">Failed to load tokens</p>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={fetchTokens}
            className="futuristic-button px-6 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orbital-verse min-h-screen">
      {/* Navigation Bar */}
      <nav className="space-nav sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800 data-glow">OrbitalVerse</h1>
              <div className="hidden md:flex items-center gap-6">
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-gray-800 transition-colors font-medium"
                >
                  Home
                </Link>
                <Link 
                  href="/tokens" 
                  className="text-gray-800 font-medium border-b-2 border-blue-500"
                >
                  Token Charts
                </Link>
                <Link 
                  href="/trade" 
                  className="text-gray-600 hover:text-gray-800 transition-colors font-medium"
                >
                  Trade
                </Link>
              </div>
            </div>
            
            {/* Mobile Menu */}
            <div className="md:hidden">
              <div className="flex items-center gap-4">
                <Link 
                  href="/" 
                  className="futuristic-button px-4 py-2 text-sm"
                >
                  Home
                </Link>
                <Link 
                  href="/trade" 
                  className="futuristic-button px-4 py-2 text-sm bg-green-500 hover:bg-green-600"
                >
                  Trade
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 data-glow">
            Token Price Charts
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Click on any token to view its price chart, historical data, and trading interface. 
            Connect your wallet to see your token balances and trade.
          </p>
        </div>

        <div className="mb-8">
          <div className="futuristic-card p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 data-glow">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg hover-lift">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Real-time Charts</h3>
                <p className="text-sm text-gray-600">
                  Interactive price charts with multiple timeframes (1D, 7D, 30D, 1Y)
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg hover-lift">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Buy & Sell</h3>
                <p className="text-sm text-gray-600">
                  Trade tokens directly with price impact and slippage protection
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg hover-lift">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Wallet Integration</h3>
                <p className="text-sm text-gray-600">
                  Connect your wallet to view balances and execute trades
                </p>
              </div>
            </div>
          </div>
        </div>

        <TokenList tokens={tokens} />
      </div>
    </div>
  );
} 