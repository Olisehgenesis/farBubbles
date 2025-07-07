"use client";

import { useState, useEffect } from "react";
import { Token, TokenList } from "~/types/tokens";
import TokenPlanet from "./TokenPlanet";
import TokenDialog from "./TokenDialog";
import BottomNavSheet from "./BottomNavSheet";
import ChainSelector from "./ChainSelector";
import sdk, { type Context } from "@farcaster/frame-sdk";
import { useTokenPrice } from "~/lib/hooks/useTokenPrice";

// Ubeswap token list URL
const UBESWAP_TOKEN_LIST_URL = "https://raw.githubusercontent.com/Ubeswap/default-token-list/master/ubeswap.token-list.json";

// Helper to generate clustered random positions
function getRandomPosition(index: number, total: number) {
  // Use a spiral pattern to ensure better visibility
  const angle = (index / total) * 2 * Math.PI * 2; // Double spiral
  const radius = 20 + (index * 15) + Math.random() * 10; // Increasing radius with some randomness
  const centerX = 50 + Math.cos(angle) * radius;
  const centerY = 50 + Math.sin(angle) * radius * 0.8; // Slightly oval
  
  // Add some randomness but keep within bounds
  const finalX = Math.max(10, Math.min(90, centerX + (Math.random() - 0.5) * 20));
  const finalY = Math.max(15, Math.min(85, centerY + (Math.random() - 0.5) * 15));
  
  return { left: `${finalX}%`, top: `${finalY}%` };
}

type TimeFrame = '1h' | '24h' | '7d' | '30d';

export default function TokenPlanets() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState<'celo' | 'base' | 'monad' | 'solana'>('celo');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('24h');

  const fetchTokenList = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch(UBESWAP_TOKEN_LIST_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch token list: ${response.status}`);
      }
      
      const tokenList: TokenList = await response.json();
      setTokens(tokenList.tokens);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error fetching token list:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tokens');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenList();
  }, []);

  // SDK initialization
  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);   
      console.log("Calling ready");
      sdk.actions.ready({});
    };
    
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  const filteredTokens = tokens.filter(token =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTokenClick = (token: Token) => {
    setSelectedToken(token);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedToken(null);
  };

  // Time frame switcher component
  const TimeFrameSwitcher = () => (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-full p-1 border border-purple-200/30 shadow-lg">
        <div className="flex items-center gap-1">
          {(['1h', '24h', '7d', '30d'] as TimeFrame[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFrame(tf)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                timeFrame === tf
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading || !isSDKLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        {/* Background stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
        
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg font-medium">
            {isLoading ? 'Loading Orbital Caps...' : 'Initializing SDK...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        {/* Background stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
        
        <div className="text-center relative z-10">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-red-300/30">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-purple-200 text-lg mb-2 font-medium">Failed to load tokens</p>
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden"
      style={{ 
        paddingTop: context?.client.safeAreaInsets?.top ?? 0, 
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Time Frame Switcher */}
      {selectedChain === 'celo' && <TimeFrameSwitcher />}

      {/* Top spacing for bottom nav */}
      <div className="pb-20"></div>

      {/* Floating Search Button */}
      {selectedChain === 'celo' && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-14 h-14 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      )}

      {/* Search Modal */}
      {selectedChain === 'celo' && isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md shadow-2xl border border-purple-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-white">Search Planets</h3>
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              placeholder="Search for planets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-purple-300/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="mt-4 text-sm text-gray-400">
              Found {filteredTokens.length} planets
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 p-4">
        {/* Token Grid */}
        {selectedChain === 'celo' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 p-4">
            {filteredTokens.map((token, index) => (
              <TokenPlanet
                key={`${token.address}-${token.chainId}`}
                token={token}
                index={index}
                onTokenClick={handleTokenClick}
                timeFrame={timeFrame}
              />
            ))}
          </div>
        )}

        {/* Other chains placeholder */}
        {selectedChain !== 'celo' && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-400">
              {selectedChain.charAt(0).toUpperCase() + selectedChain.slice(1)} planets are being discovered...
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavSheet 
        selectedChain={selectedChain}
        onChainChange={setSelectedChain}
        tokensCount={tokens.length}
        lastUpdated={lastUpdated}
        onRefresh={fetchTokenList}
        isLoading={isLoading}
      />

      {/* Token Dialog */}
      {selectedToken && (
        <TokenDialog
          token={selectedToken}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
        />
      )}
    </div>
  );
} 