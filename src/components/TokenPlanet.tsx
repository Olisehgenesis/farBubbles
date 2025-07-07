"use client";

import { Token } from "~/types/tokens";
import { cn } from "~/lib/utils";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useTokenPrice } from "~/lib/hooks/useTokenPrice";

interface TokenPlanetProps {
  token: Token;
  index: number;
  onTokenClick: (token: Token) => void;
  timeFrame: '1h' | '24h' | '7d' | '30d';
}

export default function TokenPlanet({ token, index, onTokenClick, timeFrame }: TokenPlanetProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isElevated, setIsElevated] = useState(false);

  // Get price data for the token
  const { currentPrice, priceChange24h, isLoading: priceLoading } = useTokenPrice(token.symbol, timeFrame === '1h' ? '1d' : timeFrame === '24h' ? '1d' : timeFrame === '7d' ? '7d' : '30d');

  // Calculate size based on price change
  const baseSize = 80;
  const sizeVariation = (index % 4) * 8;
  const priceChangeMultiplier = priceChange24h ? Math.abs(priceChange24h) / 10 : 0; // Scale factor based on price change
  const size = baseSize + sizeVariation + (priceChangeMultiplier * 20); // Increase size based on price volatility
  
  // Slower, more majestic animation for planet feel
  const animationDelay = (index * 0.15) % 4;
  const animationDuration = 12 + (index % 3) * 3;
  
  // Cosmic color scheme with price-based variations
  const getPlanetColors = () => {
    if (priceChange24h > 0) {
      // Green gradient for positive growth
      return 'from-green-500/30 to-emerald-600/40';
    } else if (priceChange24h < 0) {
      // Yellow/amber gradient for negative growth
      return 'from-amber-500/30 to-yellow-600/40';
    } else {
      // Default purple gradient
      const defaultColors = [
        'from-purple-500/30 to-purple-600/40',
        'from-indigo-500/30 to-indigo-600/40',
        'from-blue-500/30 to-blue-600/40',
        'from-cyan-500/30 to-cyan-600/40',
        'from-violet-500/30 to-violet-600/40',
        'from-slate-500/30 to-slate-600/40'
      ];
      return defaultColors[index % 6];
    }
  };

  const planetColors = getPlanetColors();

  // Planet surface patterns
  const surfacePatterns = [
    'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 0%, transparent 50%)',
    'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.4) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)',
    'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 60%), radial-gradient(ellipse at 25% 75%, rgba(255,255,255,0.2) 0%, transparent 50%)',
    'radial-gradient(circle at 40% 60%, rgba(255,255,255,0.3) 0%, transparent 45%), radial-gradient(circle at 60% 40%, rgba(255,255,255,0.2) 0%, transparent 45%)',
    'radial-gradient(ellipse at 30% 70%, rgba(255,255,255,0.4) 0%, transparent 55%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 55%)',
    'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 0%, transparent 50%)'
  ][index % 6];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const handleClick = () => {
    setIsElevated(true);
    setTimeout(() => setIsElevated(false), 2000);
    onTokenClick(token);
  };

  // Format price change for display
  const formatPriceChange = (change: number) => {
    if (!change) return null;
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  // Get price change color
  const getPriceChangeColor = () => {
    if (!priceChange24h) return 'text-white';
    return priceChange24h > 0 ? 'text-green-400' : 'text-amber-400';
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={cn(
          "bubble-planet relative group cursor-pointer transition-all duration-1000 ease-out",
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-50",
          "animate-wobble",
          isHovered && "elevated-planet",
          isElevated && "elevated-planet"
        )}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          zIndex: isElevated ? 1000 : (isHovered ? 100 + index : 10 + (index % 10)),
          animationDelay: `${animationDelay}s`,
          animationDuration: `${animationDuration}s`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Price change indicator */}
        {priceChange24h && (
          <div className={cn(
            "absolute -top-2 -right-2 z-20 px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm border transition-all duration-300",
            priceChange24h > 0 
              ? "bg-green-500/20 text-green-400 border-green-400/30" 
              : "bg-amber-500/20 text-amber-400 border-amber-400/30",
            isHovered && "scale-110"
          )}>
            {formatPriceChange(priceChange24h)}
          </div>
        )}

        {/* Growth indicator arrow */}
        {priceChange24h && (
          <div className={cn(
            "absolute -bottom-1 -right-1 z-20 w-4 h-4 transition-all duration-300",
            isHovered && "scale-125"
          )}>
            {priceChange24h > 0 ? (
              <svg className="w-full h-full text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 14l5-5 5 5z"/>
              </svg>
            ) : (
              <svg className="w-full h-full text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            )}
          </div>
        )}

        {/* Planet atmosphere glow */}
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-br from-white/10 via-transparent to-transparent",
            "blur-sm",
            "transition-all duration-700",
            isHovered && "scale-110 opacity-80"
          )}
          style={{
            background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)`,
          }}
        />

        {/* Outer planet shell - main surface */}
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-br from-white/20 via-transparent to-white/10",
            "border border-white/30 shadow-2xl",
            "backdrop-blur-sm",
            "transition-all duration-700",
            isHovered && "scale-105 shadow-purple-400/40"
          )}
          style={{
            background: `
              ${surfacePatterns},
              linear-gradient(135deg, ${planetColors.split(' ')[0].replace('from-', 'rgba(').replace('/', ',0.3)')}, ${planetColors.split(' ')[1].replace('to-', 'rgba(').replace('/', ',0.4)')})
            `,
            filter: 'blur(0.5px)',
          }}
        />

        {/* Planet surface texture */}
        <div
          className={cn(
            "absolute inset-2 rounded-full",
            "bg-gradient-to-br from-white/15 to-transparent",
            "backdrop-blur-md",
            "transition-all duration-700",
            isHovered && "scale-102"
          )}
          style={{
            background: `
              radial-gradient(circle at 40% 40%, rgba(255,255,255,0.2) 0%, transparent 50%),
              radial-gradient(circle at 60% 60%, rgba(255,255,255,0.1) 0%, transparent 50%)
            `
          }}
        />

        {/* Planet surface details */}
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-br from-white/30 via-transparent to-transparent",
            "opacity-60",
            "transition-all duration-500",
            isHovered && "opacity-80"
          )}
          style={{
            background: `
              radial-gradient(ellipse at 35% 35%, rgba(255,255,255,0.4) 0%, transparent 40%),
              radial-gradient(ellipse at 65% 65%, rgba(255,255,255,0.3) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 15%, rgba(255,255,255,0.3) 0%, transparent 30%)
            `
          }}
        />

        {/* Planet rim highlight */}
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "border border-white/40",
            "transition-all duration-500",
            isHovered && "border-white/60"
          )}
        />

        {/* Token content in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            {token.logoURI ? (
              <Image
                src={token.logoURI}
                alt={token.symbol}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <span className={cn(
              "text-sm font-bold text-white hidden",
              !token.logoURI && "block"
            )}>
              {token.symbol.slice(0, 2)}
            </span>
          </div>
        </div>

        {/* Orbital rings */}
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "opacity-0 transition-opacity duration-700",
            isHovered && "opacity-100"
          )}
        >
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-purple-400/30 animate-pulse"
              style={{
                inset: `${-8 - i * 4}px`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Floating space debris */}
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "opacity-0 transition-opacity duration-500",
            isHovered && "opacity-100"
          )}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/80 rounded-full animate-ping"
              style={{
                left: `${15 + i * 15}%`,
                top: `${15 + i * 12}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: '2.5s',
              }}
            />
          ))}
        </div>

        {/* Hover tooltip with price info */}
        {isHovered && (
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-purple-200/30 shadow-xl min-w-[120px]">
              <div className="text-center">
                <p className="text-white font-semibold text-sm">{token.symbol}</p>
                {currentPrice > 0 && (
                  <p className="text-purple-300 text-xs">${currentPrice.toFixed(4)}</p>
                )}
                {priceChange24h && (
                  <p className={cn("text-xs font-medium", getPriceChangeColor())}>
                    {formatPriceChange(priceChange24h)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 