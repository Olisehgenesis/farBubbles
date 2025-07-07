import { useState, useEffect } from 'react';

interface TokenPriceData {
  timestamp: number;
  price: number;
}

interface TokenPriceInfo {
  currentPrice: number;
  priceChange24h: number;
  priceData: TokenPriceData[];
  isLoading: boolean;
  error: string | null;
}

// Cache for price data to avoid excessive API calls
const priceCache = new Map<string, { data: TokenPriceInfo; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useTokenPrice(tokenSymbol: string, timeframe: '1d' | '7d' | '30d' | '1y' = '7d') {
  const [priceInfo, setPriceInfo] = useState<TokenPriceInfo>({
    currentPrice: 0,
    priceChange24h: 0,
    priceData: [],
    isLoading: true,
    error: null,
  });

  // Map token symbols to CoinGecko IDs
  const getCoinGeckoId = (symbol: string): string | null => {
    const mapping: { [key: string]: string } = {
      'CELO': 'celo',
      'cUSD': 'celo-dollar',
      'cEUR': 'celo-euro',
      'cREAL': 'celo-real',
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'USDC': 'usd-coin',
      'USDT': 'tether',
      'WETH': 'weth',
      'WBTC': 'wrapped-bitcoin',
      'DAI': 'dai',
      'LINK': 'chainlink',
      'UNI': 'uniswap',
      'AAVE': 'aave',
      'COMP': 'compound-governance-token',
      'CRV': 'curve-dao-token',
      'SUSHI': 'sushi',
      'YFI': 'yearn-finance',
      'SNX': 'havven',
      'BAL': 'balancer',
    };
    return mapping[symbol.toUpperCase()] || null;
  };

  // Generate mock data for fallback
  const generateMockData = (): TokenPriceData[] => {
    const now = Date.now();
    const data: TokenPriceData[] = [];
    const basePrice = 1.23;
    
    for (let i = 30; i >= 0; i--) {
      data.push({
        timestamp: now - i * 24 * 60 * 60 * 1000,
        price: basePrice + Math.random() * 0.5 - 0.25,
      });
    }
    return data;
  };

  const fetchPriceData = async () => {
    const cacheKey = `${tokenSymbol}-${timeframe}`;
    const cached = priceCache.get(cacheKey);
    
    // Check if we have valid cached data
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setPriceInfo(cached.data);
      return;
    }

    try {
      setPriceInfo(prev => ({ ...prev, isLoading: true, error: null }));

      const coinId = getCoinGeckoId(tokenSymbol);
      
      // If token is not supported on CoinGecko, return neutral data
      if (!coinId) {
        const neutralData: TokenPriceInfo = {
          currentPrice: 1.00,
          priceChange24h: 0,
          priceData: generateMockData(),
          isLoading: false,
          error: null,
        };
        
        priceCache.set(cacheKey, { data: neutralData, timestamp: Date.now() });
        setPriceInfo(neutralData);
        return;
      }
      
      // Get current price and 24h change
      const priceResponse = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`
      );
      
      if (!priceResponse.ok) {
        throw new Error(`Price API error: ${priceResponse.status}`);
      }
      
      const priceData = await priceResponse.json();
      
      let currentPrice = 0;
      let priceChange24h = 0;
      
      if (priceData[coinId]) {
        currentPrice = priceData[coinId].usd;
        priceChange24h = priceData[coinId].usd_24h_change || 0;
      }

      // Get historical data
      const days = timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 365;
      const chartResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      
      if (!chartResponse.ok) {
        throw new Error(`Chart API error: ${chartResponse.status}`);
      }
      
      const chartData = await chartResponse.json();
      
      let priceDataArray: TokenPriceData[] = [];
      
      if (chartData.prices && Array.isArray(chartData.prices)) {
        priceDataArray = chartData.prices.map(([timestamp, price]: [number, number]) => ({
          timestamp,
          price,
        }));
      }

      const newPriceInfo: TokenPriceInfo = {
        currentPrice,
        priceChange24h,
        priceData: priceDataArray,
        isLoading: false,
        error: null,
      };

      // Cache the data
      priceCache.set(cacheKey, { data: newPriceInfo, timestamp: Date.now() });
      
      setPriceInfo(newPriceInfo);
      
    } catch (error) {
      // Silently handle errors and return neutral data
      const fallbackData: TokenPriceInfo = {
        currentPrice: 1.00,
        priceChange24h: 0,
        priceData: generateMockData(),
        isLoading: false,
        error: null,
      };
      
      priceCache.set(cacheKey, { data: fallbackData, timestamp: Date.now() });
      setPriceInfo(fallbackData);
    }
  };

  useEffect(() => {
    fetchPriceData();
  }, [tokenSymbol, timeframe]);

  const refetch = () => {
    fetchPriceData();
  };

  return {
    ...priceInfo,
    refetch,
  };
} 