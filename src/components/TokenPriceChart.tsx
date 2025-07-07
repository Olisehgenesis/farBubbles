"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Token } from "~/types/tokens";
import { cn } from "~/lib/utils";
import Image from "next/image";
import { useAccount, useBalance } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTokenPrice } from "~/lib/hooks/useTokenPrice";

interface TokenPriceChartProps {
  token: Token;
  onClose?: () => void;
}

export default function TokenPriceChart({ token, onClose }: TokenPriceChartProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeframe, setTimeframe] = useState<'1d' | '7d' | '30d' | '1y'>('7d');

  const { currentPrice, priceChange24h, priceData, isLoading, error } = useTokenPrice(token.symbol, timeframe);

  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: token.address as `0x${string}`,
  });

  // Safety check to ensure providers are ready
  if (typeof window === 'undefined') {
    return null;
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    setIsProcessing(true);
    console.log(`${activeTab} ${amount} ${token.symbol}`);
    
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

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-medium">Loading price data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl shadow-2xl border border-purple-200/50 backdrop-blur-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-200/30">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center border border-white/50">
              {token.logoURI ? (
                <Image
                  src={token.logoURI}
                  alt={token.symbol}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-purple-800">
                  {token.symbol.slice(0, 2)}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-purple-800">{token.name}</h2>
              <p className="text-lg text-purple-600">{token.symbol}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Wallet Connection */}
            {!isConnected ? (
              <ConnectButton />
            ) : (
              <div className="text-right">
                <p className="text-sm text-purple-600">Connected</p>
                <p className="text-xs text-purple-500 font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
            )}
            
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/40 hover:bg-white/60 flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Price Display */}
        <div className="p-6 border-b border-purple-200/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-purple-800">
                {formatPrice(currentPrice)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "text-sm font-medium",
                  priceChange24h >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
                </span>
                <span className="text-sm text-purple-600">24h</span>
              </div>
            </div>
            
            {/* Token Balance */}
            {isConnected && (
              <div className="text-right">
                <p className="text-sm text-purple-600">Your Balance</p>
                <p className="text-lg font-bold text-purple-800">
                  {formatBalance(balance?.formatted)} {token.symbol}
                </p>
                <p className="text-xs text-purple-500">
                  ≈ {formatPrice(parseFloat(balance?.formatted || '0') * currentPrice)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="p-6 border-b border-purple-200/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-800">Price Chart</h3>
            <div className="flex gap-2">
              {(['1d', '7d', '30d', '1y'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-sm font-medium transition-colors",
                    timeframe === period
                      ? "bg-purple-500 text-white"
                      : "bg-white/60 text-purple-600 hover:bg-white/80"
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTimestamp}
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis
                  domain={['dataMin - 0.1', 'dataMax + 0.1']}
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <Tooltip
                  labelFormatter={formatTimestamp}
                  formatter={(value: number) => [formatPrice(value), 'Price']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: '#8b5cf6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Buy/Sell Section */}
        <div className="p-6">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">
                Amount ({activeTab === 'buy' ? 'USD' : token.symbol})
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
                    {activeTab === 'buy' ? 'USD' : token.symbol}
                  </span>
                </div>
              </div>
            </div>

            {/* Estimated Output */}
            {amount && (
              <div className="bg-white/40 rounded-lg p-4 border border-purple-200/30">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-600">
                    Estimated {activeTab === 'buy' ? token.symbol : 'USD'}
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
                `${activeTab === 'buy' ? 'Buy' : 'Sell'} ${token.symbol}`
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-purple-200/30">
            <div className="grid grid-cols-2 gap-4 text-sm text-purple-600">
              <div>
                <span className="block">Network Fee</span>
                <span className="font-medium text-purple-700">~0.001 CELO</span>
              </div>
              <div>
                <span className="block">Slippage</span>
                <span className="font-medium text-purple-700">0.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 