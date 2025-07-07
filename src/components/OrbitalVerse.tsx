"use client";

import { useState, useEffect } from "react";
import { Token, TokenList } from "~/types/tokens";
import { useTokenPrice } from "~/lib/hooks/useTokenPrice";
import { cn } from "~/lib/utils";
import Image from "next/image";
import Link from "next/link";

// Ubeswap token list URL
const UBESWAP_TOKEN_LIST_URL = "https://raw.githubusercontent.com/Ubeswap/default-token-list/master/ubeswap.token-list.json";

type TimeFrame = '1h' | '24h' | '7d' | '30d';

interface OrbitalPlanetProps {
  token: Token;
  index: number;
  timeFrame: TimeFrame;
  onPlanetClick: (token: Token) => void;
}

// Generate unique orbital positions to prevent overlap
function generateOrbitalPosition(index: number, total: number) {
  // Use different orbital rings to prevent overlap
  const orbitalRings = [80, 120, 160, 200, 240];
  const ringIndex = Math.floor(index / 8); // 8 planets per ring
  const ringRadius = orbitalRings[ringIndex % orbitalRings.length];
  
  // Distribute planets evenly around each ring
  const planetsPerRing = 8;
  const angleStep = (2 * Math.PI) / planetsPerRing;
  const planetIndexInRing = index % planetsPerRing;
  const angle = planetIndexInRing * angleStep + (ringIndex * 0.3); // Offset each ring
  
  // Add some randomness within safe bounds
  const randomOffset = (Math.random() - 0.5) * 20;
  const x = Math.cos(angle) * (ringRadius + randomOffset);
  const y = Math.sin(angle) * (ringRadius + randomOffset);
  
  // Ensure planets stay within visible bounds (15% to 85% of container)
  const boundedX = Math.max(15, Math.min(85, 50 + (x / 300) * 70));
  const boundedY = Math.max(15, Math.min(85, 50 + (y / 300) * 70));
  
  return {
    x: `${boundedX}%`,
    y: `${boundedY}%`,
    z: ringIndex * 10 + Math.random() * 5,
    orbitRadius: ringRadius,
    orbitSpeed: 25 + (ringIndex * 3) + (planetIndexInRing * 2),
  };
}

function OrbitalPlanet({ token, index, timeFrame, onPlanetClick }: OrbitalPlanetProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { currentPrice, priceChange24h, isLoading } = useTokenPrice(
    token.symbol, 
    timeFrame === '1h' ? '1d' : timeFrame === '24h' ? '1d' : timeFrame === '7d' ? '7d' : '30d'
  );

  const position = generateOrbitalPosition(index, 100);
  
  // Calculate planet size based on market cap and price change
  const baseSize = 60;
  const marketCapMultiplier = Math.min(Math.abs(priceChange24h || 0) / 10, 2);
  const size = baseSize + (marketCapMultiplier * 30);
  
  // Determine planet state and styling
  const isGrowing = priceChange24h && priceChange24h > 0;
  const isShrinking = priceChange24h && priceChange24h < 0;
  const isNeutral = !priceChange24h || Math.abs(priceChange24h) < 0.1;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const handleClick = () => {
    onPlanetClick(token);
  };

  return (
    <div
      className={cn(
        "absolute planet-3d cursor-pointer transition-all duration-1000 ease-out",
        isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-50",
        isGrowing && "planet-growing planet-glow-green",
        isShrinking && "planet-shrinking planet-glow-red",
        isNeutral && "planet-glow-neutral"
      )}
      style={{
        left: position.x,
        top: position.y,
        zIndex: isHovered ? 1000 : Math.floor(position.z),
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${index * 0.2}s`,
        animationDuration: `${position.orbitSpeed}s`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Orbital Ring */}
      <div
        className="orbital-ring absolute inset-0"
        style={{
          width: `${size + 20}px`,
          height: `${size + 20}px`,
          left: '-10px',
          top: '-10px',
        }}
      />

      {/* Planet Core */}
      <div
        className={cn(
          "absolute inset-0 rounded-full transition-all duration-700",
          "bg-gradient-to-br from-white/90 via-white/70 to-white/50",
          "border border-white/30 shadow-2xl",
          "backdrop-blur-sm",
          isHovered && "scale-110 shadow-blue-400/40"
        )}
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(255,255,255,0.7) 0%, transparent 50%),
            linear-gradient(135deg, 
              ${isGrowing ? 'rgba(34, 197, 94, 0.3)' : isShrinking ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}, 
              ${isGrowing ? 'rgba(16, 185, 129, 0.4)' : isShrinking ? 'rgba(220, 38, 38, 0.4)' : 'rgba(37, 99, 235, 0.4)'})
          `,
        }}
      />

      {/* Planet Surface */}
      <div
        className={cn(
          "absolute inset-2 rounded-full",
          "bg-gradient-to-br from-white/20 to-transparent",
          "backdrop-blur-md"
        )}
        style={{
          background: `
            radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3) 0%, transparent 50%),
            radial-gradient(circle at 60% 60%, rgba(255,255,255,0.2) 0%, transparent 50%)
          `
        }}
      />

      {/* Token Logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
          {token.logoURI ? (
            <Image
              src={token.logoURI}
              alt={token.symbol}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-gray-800">
              {token.symbol.slice(0, 2)}
            </span>
          )}
        </div>
      </div>

      {/* Price Change Indicator */}
      {priceChange24h && (
        <div
          className={cn(
            "absolute -top-1 -right-1 z-20 px-2 py-1 rounded-full text-xs font-bold",
            "backdrop-blur-sm border transition-all duration-300",
            isGrowing 
              ? "bg-green-500/20 text-green-700 border-green-400/30" 
              : "bg-red-500/20 text-red-700 border-red-400/30",
            isHovered && "scale-110"
          )}
        >
          {priceChange24h > 0 ? '+' : ''}{priceChange24h.toFixed(1)}%
        </div>
      )}

      {/* Hover Tooltip */}
      {isHovered && (
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-50">
          <div className="futuristic-card p-3 min-w-[140px]">
            <div className="text-center">
              <p className="text-gray-800 font-semibold text-sm">{token.symbol}</p>
              <p className="text-gray-600 text-xs">{token.name}</p>
              {currentPrice > 0 && (
                <p className="text-blue-600 text-xs font-medium">${currentPrice.toFixed(4)}</p>
              )}
              {priceChange24h && (
                <p className={cn(
                  "text-xs font-bold",
                  isGrowing ? "text-green-600 positive-glow" : "text-red-600 negative-glow"
                )}>
                  {priceChange24h > 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrbitalVerse() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('24h');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [showTokenModal, setShowTokenModal] = useState(false);

  const fetchTokenList = async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log('Fetching token list from:', UBESWAP_TOKEN_LIST_URL);
      
      const response = await fetch(UBESWAP_TOKEN_LIST_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch token list: ${response.status}`);
      }
      
      const tokenList: TokenList = await response.json();
      console.log('Fetched tokens:', tokenList.tokens.length);
      setTokens(tokenList.tokens); // Use all tokens from API
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

  const handlePlanetClick = (token: Token) => {
    setSelectedToken(token);
    setShowTokenModal(true);
  };

  const handleCloseModal = () => {
    setShowTokenModal(false);
    setSelectedToken(null);
  };

  if (isLoading) {
    return (
      <div className="orbital-verse min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="stellar-loader w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Initializing OrbitalVerse...</p>
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
            onClick={fetchTokenList}
            className="futuristic-button px-6 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="orbital-verse min-h-screen relative overflow-hidden"
      style={{ 
        paddingTop: 'env(safe-area-inset-top, 0px)', 
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      {/* Cosmic Background */}
      <div className="cosmic-bg absolute inset-0" />
      
      {/* Stellar Particles */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="stellar-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}

      {/* Time Frame Switcher */}
      <div 
        className="absolute right-6 z-40"
        style={{ 
          top: `calc(env(safe-area-inset-top, 0px) + 80px)`,
        }}
      >
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          {(['1h', '24h', '7d', '30d'] as TimeFrame[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFrame(tf)}
              className={cn(
                "px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200",
                timeFrame === tf
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center py-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 data-glow">
            Crypto Universe
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore the digital cosmos where each planet represents a cryptocurrency. 
            Watch as they grow and shrink with market movements.
          </p>
        </div>

        {/* Orbital Space */}
        <div className="relative w-full h-[70vh] overflow-hidden">
          {tokens.length > 0 ? (
            tokens.map((token, index) => (
              <OrbitalPlanet
                key={`${token.address}-${token.chainId}`}
                token={token}
                index={index}
                timeFrame={timeFrame}
                onPlanetClick={handlePlanetClick}
              />
            ))
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading planets...</p>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="container mx-auto px-6 py-8">
          <div className="futuristic-card p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Planet Legend</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full planet-glow-green"></div>
                <span className="text-sm text-gray-600">Growing (Positive)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full planet-glow-red"></div>
                <span className="text-sm text-gray-600">Shrinking (Negative)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full planet-glow-neutral"></div>
                <span className="text-sm text-gray-600">Neutral</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Modal */}
      {selectedToken && showTokenModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="futuristic-card p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/40 flex items-center justify-center">
                  {selectedToken.logoURI ? (
                    <Image
                      src={selectedToken.logoURI}
                      alt={selectedToken.symbol}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-gray-800">
                      {selectedToken.symbol.slice(0, 2)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{selectedToken.name}</h3>
                  <p className="text-sm text-gray-600">{selectedToken.symbol}</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Chain ID</p>
                <p className="font-semibold text-gray-800">{selectedToken.chainId}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Decimals</p>
                <p className="font-semibold text-gray-800">{selectedToken.decimals}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-mono text-xs text-gray-800 break-all">
                  {selectedToken.address}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <Link
                href={`/tokens?token=${selectedToken.symbol}`}
                className="futuristic-button flex-1 text-center py-2"
              >
                View Charts
              </Link>
              <Link
                href={`/trade?token=${selectedToken.symbol}`}
                className="futuristic-button flex-1 text-center py-2 bg-green-500 hover:bg-green-600"
              >
                Trade
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 