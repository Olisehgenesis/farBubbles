"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "~/lib/utils";

export type Chain = 'celo' | 'base' | 'monad' | 'solana';

interface ChainInfo {
  id: Chain;
  name: string;
  icon: string;
  color: string;
  available: boolean;
}

const CHAINS: ChainInfo[] = [
  {
    id: 'celo',
    name: 'Celo',
    icon: '🌱',
    color: 'emerald',
    available: true
  },
  {
    id: 'base',
    name: 'Base',
    icon: '🔵',
    color: 'blue',
    available: false
  },
  {
    id: 'monad',
    name: 'Monad',
    icon: '🟣',
    color: 'purple',
    available: false
  },
  {
    id: 'solana',
    name: 'Solana',
    icon: '🟡',
    color: 'yellow',
    available: false
  }
];

interface ChainSelectorProps {
  selectedChain: Chain;
  onChainChange: (chain: Chain) => void;
}

export default function ChainSelector({ selectedChain, onChainChange }: ChainSelectorProps) {
  const [showComingSoon, setShowComingSoon] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChainClick = (chain: ChainInfo) => {
    if (chain.available) {
      onChainChange(chain.id);
      setIsOpen(false);
    } else {
      setShowComingSoon(chain.name);
      setTimeout(() => setShowComingSoon(null), 2000);
    }
  };

  const selectedChainInfo = CHAINS.find(chain => chain.id === selectedChain);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Chain Selector Dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-sm border border-emerald-200/50 rounded-lg shadow-lg hover:bg-white/60 transition-all duration-200"
      >
        <span className="text-lg">{selectedChainInfo?.icon}</span>
        <span className="font-medium text-emerald-700">{selectedChainInfo?.name}</span>
        <svg 
          className={`w-4 h-4 text-emerald-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl border border-emerald-200/50 z-50">
          {CHAINS.map((chain) => {
            const isSelected = selectedChain === chain.id;
            const isAvailable = chain.available;
            
            return (
              <button
                key={chain.id}
                onClick={() => handleChainClick(chain)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 relative",
                  isSelected
                    ? "bg-emerald-100 text-emerald-800"
                    : isAvailable
                      ? "text-emerald-700 hover:bg-emerald-50"
                      : "text-gray-400 cursor-not-allowed opacity-60"
                )}
                disabled={!isAvailable}
              >
                <span className="text-lg">{chain.icon}</span>
                <span className="font-medium">{chain.name}</span>
                
                {/* Coming Soon Badge */}
                {!isAvailable && (
                  <span className="absolute right-3 bg-gray-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    Soon
                  </span>
                )}
                
                {/* Selected Check */}
                {isSelected && (
                  <svg className="absolute right-3 w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Coming Soon Toast */}
      {showComingSoon && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-in slide-in-from-top-2 duration-200">
            {showComingSoon} coming soon! 🚀
          </div>
        </div>
      )}
    </div>
  );
} 