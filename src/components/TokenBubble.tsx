"use client";

import { Token } from "~/types/tokens";
import { cn } from "~/lib/utils";
import { useState, useEffect } from "react";

interface TokenBubbleProps {
  token: Token;
  index: number;
  totalTokens: number;
  onTokenClick: (token: Token) => void;
}

export default function TokenBubble({ token, index, totalTokens, onTokenClick }: TokenBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate consistent size with subtle variations for natural feel
  const baseSize = 70; // All bubbles same base size
  const sizeVariation = (index % 3) * 5; // Only 0, 5, or 10px variation
  const size = baseSize + sizeVariation;
  
  // Slower, more gentle animation for water molecule feel
  const animationDelay = (index * 0.1) % 3; // Reduced delay for closer movement
  const animationDuration = 8 + (index % 2) * 2; // 8-10 seconds for slower movement
  
  // Celo color scheme: emerald, amber, lime
  const bubbleColor = [
    'from-emerald-400/20 to-emerald-500/30',
    'from-amber-400/20 to-amber-500/30',
    'from-lime-400/20 to-lime-500/30',
    'from-emerald-300/20 to-emerald-400/30',
    'from-amber-300/20 to-amber-400/30'
  ][index % 5];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), index * 50); // Faster loading
    return () => clearTimeout(timer);
  }, [index]);

  const handleClick = () => {
    onTokenClick(token);
  };

  return (
    <div
      className={cn(
        "relative group cursor-pointer transition-all duration-700 ease-out",
        isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-50"
      )}
      style={{
        animationDelay: `${animationDelay}s`,
        animationDuration: `${animationDuration}s`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* 3D Bubble with multiple layers for depth */}
      <div
        className={cn(
          "relative",
          "animate-bubble-float-gentle"
        )}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${animationDelay}s`,
          animationDuration: `${animationDuration}s`,
        }}
      >
        {/* Outer bubble shell - glass-like transparency */}
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-br from-white/30 via-transparent to-white/15",
            "border border-white/40 shadow-2xl",
            "backdrop-blur-sm",
            "transition-all duration-500",
            isHovered && "scale-105 shadow-emerald-400/30"
          )}
          style={{
            background: `
              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.3) 0%, transparent 50%),
              linear-gradient(135deg, ${bubbleColor.split(' ')[0].replace('from-', 'rgba(').replace('/', ',0.2)')}, ${bubbleColor.split(' ')[1].replace('to-', 'rgba(').replace('/', ',0.3)')})
            `,
            filter: 'blur(0.5px)',
          }}
        />

        {/* Inner bubble core - more transparent center */}
        <div
          className={cn(
            "absolute inset-2 rounded-full",
            "bg-gradient-to-br from-white/20 to-transparent",
            "backdrop-blur-md",
            "transition-all duration-500",
            isHovered && "scale-102"
          )}
        />

        {/* Bubble surface wrinkles and highlights */}
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-br from-white/40 via-transparent to-transparent",
            "opacity-70",
            "transition-all duration-300",
            isHovered && "opacity-90"
          )}
          style={{
            background: `
              radial-gradient(ellipse at 25% 25%, rgba(255,255,255,0.7) 0%, transparent 40%),
              radial-gradient(ellipse at 75% 75%, rgba(255,255,255,0.4) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.5) 0%, transparent 30%)
            `
          }}
        />

        {/* Bubble rim highlight */}
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "border border-white/50",
            "transition-all duration-300",
            isHovered && "border-white/70"
          )}
        />

        {/* Token content in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/40">
            {token.logoURI ? (
              <img
                src={token.logoURI}
                alt={token.symbol}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <span className={cn(
              "text-sm font-bold text-emerald-800 hidden",
              !token.logoURI && "block"
            )}>
              {token.symbol.slice(0, 2)}
            </span>
          </div>
        </div>

        {/* Floating particles inside bubble */}
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "opacity-0 transition-opacity duration-500",
            isHovered && "opacity-100"
          )}
        >
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-emerald-400/80 rounded-full animate-ping"
              style={{
                left: `${20 + i * 20}%`,
                top: `${20 + i * 15}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s',
              }}
            />
          ))}
        </div>

        {/* Bubble distortion effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-br from-transparent via-white/10 to-transparent",
            "opacity-0 transition-opacity duration-700",
            isHovered && "opacity-100"
          )}
          style={{
            filter: 'blur(1px)',
            transform: 'scale(1.1)',
          }}
        />
      </div>

      {/* Bubble interaction ripple */}
      <div
        className={cn(
          "absolute inset-0 rounded-full",
          "border-2 border-emerald-300/30",
          "opacity-0 transition-all duration-500",
          isHovered && "opacity-100 scale-120"
        )}
      />
    </div>
  );
} 