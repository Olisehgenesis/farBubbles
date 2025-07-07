"use client";

import { useState, useEffect } from "react";
import { Token } from "~/types/tokens";
import { cn } from "~/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useAccount, useBalance } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTokenPrice } from "~/lib/hooks/useTokenPrice";
import { TokenList } from "~/types/tokens";

// Ubeswap token list URL
const UBESWAP_TOKEN_LIST_URL = "https://raw.githubusercontent.com/Ubeswap/default-token-list/master/ubeswap.token-list.json";

export default function TradePage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [slippage, setSlippage] = useState(0.5);

  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: selectedToken?.address as `0x${string}`,
  });

  // Get price data for selected token
  const { currentPrice, priceChange24h, isLoading: priceLoading } = useTokenPrice(
    selectedToken?.symbol || 'CELO', 
    '1d'
  );

  const fetchTokens = async () => {
    try {
      setTokenError(null);
      setIsLoadingTokens(true);
      const response = await fetch(UBESWAP_TOKEN_LIST_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch token list: ${response.status}`);
      }
      
      const tokenList: TokenList = await response.json();
      setTokens(tokenList.tokens);
    } catch (err) {
      console.error('Error fetching token list:', err);
      setTokenError(err instanceof Error ? err.message : 'Failed to load tokens');
    } finally {
      setIsLoadingTokens(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchTokens();
  }, []);

  if (!isClient || isLoadingTokens) {
    return (
      <div className="orbital-verse min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="stellar-loader w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="orbital-verse min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-800 text-lg mb-2 font-medium">Failed to load tokens</p>
          <p className="text-red-500 text-sm mb-4">{tokenError}</p>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    setIsProcessing(true);
    console.log(`${activeTab} ${amount} ${selectedToken?.symbol}`);
    
    // Simulate transaction
    setTimeout(() => {
      setIsProcessing(false);
      setAmount('');
      alert(`${activeTab === 'buy' ? 'Buy' : 'Sell'} order submitted!`);
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  const formatBalance = (balance: string | undefined) => {
    if (!balance) return '0.00';
    return parseFloat(balance).toFixed(4);
  };

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
                  className="text-gray-600 hover:text-gray-800 transition-colors font-medium"
                >
                  Charts
                </Link>
                <Link 
                  href="/trade" 
                  className="text-gray-800 font-medium border-b-2 border-blue-500"
                >
                  Trade
                </Link>
              </div>
            </div>
            
            {/* Wallet Connection */}
            <div className="flex items-center gap-4">
              {!isConnected ? (
                <ConnectButton />
              ) : (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Connected</p>
                  <p className="text-xs text-gray-500 font-mono">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 data-glow">
              Quick Trade
            </h1>
            <p className="text-lg text-gray-600">
              Trade tokens instantly with real-time prices and minimal slippage
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Token Selection */}
            <div className="lg:col-span-1">
              <div className="futuristic-card p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 data-glow">Select Token</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {tokens.slice(0, 20).map((token) => (
                    <button
                      key={token.address}
                      onClick={() => setSelectedToken(token)}
                      className={cn(
                        "w-full p-4 rounded-xl border transition-all duration-200 text-left hover-lift",
                        selectedToken?.address === token.address
                          ? "bg-blue-100 border-blue-300 shadow-md"
                          : "bg-white/40 border-gray-200/50 hover:bg-white/60"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center border border-white/50">
                          {token.logoURI ? (
                            <Image
                              src={token.logoURI}
                              alt={token.symbol}
                              width={24}
                              height={24}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-bold text-gray-800">
                              {token.symbol.slice(0, 2)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{token.name}</p>
                          <p className="text-sm text-gray-600">{token.symbol}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Trading Interface */}
            <div className="lg:col-span-2">
              <div className="futuristic-card p-6">
                {selectedToken ? (
                  <>
                    {/* Token Info */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-white/40 flex items-center justify-center border border-white/50">
                        {selectedToken.logoURI ? (
                          <Image
                            src={selectedToken.logoURI}
                            alt={selectedToken.symbol}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-purple-800">
                            {selectedToken.symbol.slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-purple-800">{selectedToken.name}</h2>
                        <p className="text-lg text-purple-600">{selectedToken.symbol}</p>
                        {currentPrice > 0 && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-lg font-bold text-purple-800">
                              {formatPrice(currentPrice)}
                            </span>
                            {priceChange24h && (
                              <span className={cn(
                                "text-sm font-medium px-2 py-1 rounded-full",
                                priceChange24h > 0 
                                  ? "bg-green-100 text-green-700" 
                                  : "bg-amber-100 text-amber-700"
                              )}>
                                {priceChange24h > 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Balance Display */}
                    {isConnected && (
                      <div className="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-200/30">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-600">Your Balance</span>
                          <span className="font-bold text-purple-800">
                            {formatBalance(balance?.formatted)} {selectedToken.symbol}
                          </span>
                        </div>
                        {currentPrice > 0 && (
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-sm text-purple-500">≈ USD Value</span>
                            <span className="text-sm font-medium text-purple-700">
                              {formatPrice(parseFloat(balance?.formatted || '0') * currentPrice)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Buy/Sell Tabs */}
                    <div className="flex border-b border-purple-200/30 mb-6">
                      <button
                        onClick={() => setActiveTab('buy')}
                        className={cn(
                          "flex-1 py-3 text-center font-medium transition-colors",
                          activeTab === 'buy' 
                            ? "text-green-700 bg-green-100/50 border-b-2 border-green-500" 
                            : "text-purple-600 hover:text-purple-700"
                        )}
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => setActiveTab('sell')}
                        className={cn(
                          "flex-1 py-3 text-center font-medium transition-colors",
                          activeTab === 'sell' 
                            ? "text-red-700 bg-red-100/50 border-b-2 border-red-500" 
                            : "text-purple-600 hover:text-purple-700"
                        )}
                      >
                        Sell
                      </button>
                    </div>

                    {/* Trading Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-purple-700 mb-2">
                          Amount ({activeTab === 'buy' ? 'USD' : selectedToken.symbol})
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-purple-200/50 rounded-lg text-purple-800 placeholder-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                            required
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <span className="text-sm text-purple-600 font-medium">
                              {activeTab === 'buy' ? 'USD' : selectedToken.symbol}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Estimated Output */}
                      {amount && (
                        <div className="bg-white/40 rounded-lg p-4 border border-purple-200/30">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-purple-600">
                              Estimated {activeTab === 'buy' ? selectedToken.symbol : 'USD'}
                            </span>
                            <span className="text-lg font-bold text-purple-800">
                              {activeTab === 'buy' 
                                ? (parseFloat(amount) / currentPrice).toFixed(4)
                                : (parseFloat(amount) * currentPrice).toFixed(2)
                              }
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-purple-500">Price Impact</span>
                            <span className="text-xs text-purple-600">~0.1%</span>
                          </div>
                        </div>
                      )}

                      {/* Slippage Setting */}
                      <div>
                        <label className="block text-sm font-medium text-purple-700 mb-2">
                          Slippage Tolerance
                        </label>
                        <div className="flex gap-2">
                          {[0.5, 1, 2].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setSlippage(value)}
                              className={cn(
                                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                slippage === value
                                  ? "bg-purple-500 text-white"
                                  : "bg-white/60 text-purple-600 hover:bg-white/80"
                              )}
                            >
                              {value}%
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        type="submit"
                        disabled={isProcessing || !amount || !isConnected}
                        className={cn(
                          "w-full py-4 rounded-lg font-medium transition-all duration-300",
                          activeTab === 'buy'
                            ? "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl"
                            : "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl",
                          (isProcessing || !amount || !isConnected) && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {!isConnected ? (
                          'Connect Wallet to Trade'
                        ) : isProcessing ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                          </div>
                        ) : (
                          `${activeTab === 'buy' ? 'Buy' : 'Sell'} ${selectedToken.symbol}`
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Select a Token</h3>
                    <p className="text-purple-600">Choose a token from the list to start trading</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 