"use client";

import { Token } from "~/types/tokens";
import { cn } from "~/lib/utils";
import { useState } from "react";

interface TokenDialogProps {
  token: Token | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TokenDialog({ token, isOpen, onClose }: TokenDialogProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!token || !isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
        <div className="bg-gradient-to-br from-amber-50 via-emerald-50 to-lime-50 rounded-2xl shadow-2xl border border-emerald-200/50 backdrop-blur-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-emerald-200/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center border border-white/50">
                {token.logoURI ? (
                  <img
                    src={token.logoURI}
                    alt={token.symbol}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold text-emerald-800">
                    {token.symbol.slice(0, 2)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-800">{token.name}</h3>
                <p className="text-sm text-emerald-600">{token.symbol}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-emerald-200/30">
            <button
              onClick={() => setActiveTab('buy')}
              className={cn(
                "flex-1 py-4 text-center font-medium transition-colors",
                activeTab === 'buy' 
                  ? "text-emerald-700 bg-emerald-100/50 border-b-2 border-emerald-500" 
                  : "text-emerald-600 hover:text-emerald-700"
              )}
            >
              Buy
            </button>
            <button
              onClick={() => setActiveTab('sell')}
              className={cn(
                "flex-1 py-4 text-center font-medium transition-colors",
                activeTab === 'sell' 
                  ? "text-emerald-700 bg-emerald-100/50 border-b-2 border-emerald-500" 
                  : "text-emerald-600 hover:text-emerald-700"
              )}
            >
              Sell
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">
                    Amount ({activeTab === 'buy' ? 'CELO' : token.symbol})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-emerald-200/50 rounded-lg text-emerald-800 placeholder-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className="text-sm text-emerald-600 font-medium">
                        {activeTab === 'buy' ? 'CELO' : token.symbol}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Estimated Output */}
                <div className="bg-white/40 rounded-lg p-4 border border-emerald-200/30">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-emerald-600">Estimated {activeTab === 'buy' ? 'tokens' : 'CELO'}</span>
                    <span className="text-lg font-bold text-emerald-800">
                      {amount ? (parseFloat(amount) * (activeTab === 'buy' ? 100 : 0.01)).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-emerald-500">Price Impact</span>
                    <span className="text-xs text-emerald-600">~0.1%</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="submit"
                  disabled={isProcessing || !amount}
                  className={cn(
                    "w-full py-3 rounded-lg font-medium transition-all duration-300",
                    activeTab === 'buy'
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl"
                      : "bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl",
                    (isProcessing || !amount) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    `${activeTab === 'buy' ? 'Buy' : 'Sell'} ${token.symbol}`
                  )}
                </button>
              </div>
            </form>

            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-emerald-200/30">
              <div className="grid grid-cols-2 gap-4 text-xs text-emerald-600">
                <div>
                  <span className="block">Network Fee</span>
                  <span className="font-medium text-emerald-700">~0.001 CELO</span>
                </div>
                <div>
                  <span className="block">Slippage</span>
                  <span className="font-medium text-emerald-700">0.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 