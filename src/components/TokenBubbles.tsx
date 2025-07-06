"use client";

import { useState, useEffect } from "react";
import { Token, TokenList } from "~/types/tokens";
import TokenBubble from "./TokenBubble";
import TokenDialog from "./TokenDialog";
import BottomNavSheet from "./BottomNavSheet";
import { cn } from "~/lib/utils";
import sdk, { type Context } from "@farcaster/frame-sdk";

// Ubeswap token list URL
const UBESWAP_TOKEN_LIST_URL = "https://raw.githubusercontent.com/Ubeswap/default-token-list/master/ubeswap.token-list.json";

export default function TokenBubbles() {
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

  if (isLoading || !isSDKLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-lime-50 flex items-center justify-center relative overflow-hidden">
        {/* Background atmospheric particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-300/30 rounded-full animate-pulse"
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
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-800 text-lg font-medium">
            {isLoading ? 'Loading farBubbles...' : 'Initializing SDK...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-lime-50 flex items-center justify-center relative overflow-hidden">
        {/* Background atmospheric particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-300/30 rounded-full animate-pulse"
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
          <p className="text-emerald-800 text-lg mb-2 font-medium">Failed to load tokens</p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-lime-50 relative overflow-hidden"
      style={{ 
        paddingTop: context?.client.safeAreaInsets?.top ?? 0, 
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      {/* Background atmospheric particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-300/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Top spacing for bottom nav */}
      <div className="pb-20"></div>

      {/* Floating Search Button */}
      {selectedChain === 'celo' && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
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
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md shadow-2xl border border-emerald-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-emerald-800">Search Tokens</h3>
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="w-8 h-8 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input
              id="search-input"
              type="text"
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-emerald-200/50 rounded-lg text-emerald-800 placeholder-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 shadow-lg"
              autoFocus
            />
            <div className="mt-4 text-sm text-emerald-600">
              {filteredTokens.length > 0 && (
                <p>Found {filteredTokens.length} tokens</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Token bubbles grid */}
      <div className="relative z-10 pb-8">
        <div className="container mx-auto px-4">
          {selectedChain !== 'celo' ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200/50">
                <span className="text-4xl">🚀</span>
              </div>
              <p className="text-emerald-800 text-lg font-medium mb-2">
                {selectedChain.charAt(0).toUpperCase() + selectedChain.slice(1)} Network
              </p>
              <p className="text-emerald-600 text-sm">
                Token exploration coming soon! Switch to Celo to explore current tokens.
              </p>
            </div>
          ) : filteredTokens.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-emerald-800 text-lg font-medium">No tokens found matching "{searchTerm}"</p>
            </div>
          ) : (
            <div className="relative">
              {/* Background bubble particles for atmosphere */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-emerald-300/20 rounded-full animate-pulse"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 3}s`,
                    }}
                  />
                ))}
              </div>
              
              {/* Main bubble grid with tighter spacing for water molecule feel */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-4 relative z-10">
                {filteredTokens.map((token, index) => (
                  <div
                    key={token.address}
                    className="flex justify-center"
                    style={{
                      marginTop: `${(index % 2) * 8}px`,
                      marginLeft: `${(index % 3) * 5}px`,
                    }}
                  >
                    <TokenBubble
                      token={token}
                      index={index}
                      totalTokens={filteredTokens.length}
                      onTokenClick={handleTokenClick}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-emerald-700 text-sm font-medium">
            Data from{" "}
            <a
              href="https://github.com/Ubeswap/default-token-list"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 underline font-semibold"
            >
              Ubeswap Token List
            </a>
          </p>
        </div>
      </div>

      {/* Buy/Sell Dialog */}
      <TokenDialog
        token={selectedToken}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
      />

      {/* Bottom Navigation Sheet */}
      <BottomNavSheet
        selectedChain={selectedChain}
        onChainChange={setSelectedChain}
        tokensCount={tokens.length}
        lastUpdated={lastUpdated}
        onRefresh={fetchTokenList}
        isLoading={isLoading}
      />
    </div>
  );
} 