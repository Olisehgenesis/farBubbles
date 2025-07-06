export interface CoinGeckoToken {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export interface PriceChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface TokenChartData {
  prices: Array<{
    timestamp: number;
    price: number;
    formattedTime: string;
  }>;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  isPositive: boolean;
}

const COINGECKO_API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY || 'CG-GNZeLeZxSHj7r9bDgfydDX85';
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * Search for a token by symbol and return its CoinGecko ID
 */
export async function searchTokenBySymbol(symbol: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/search?query=${encodeURIComponent(symbol)}`,
      {
        headers: {
          'accept': 'application/json',
          'x-cg-demo-api-key': COINGECKO_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Find exact symbol match (case-insensitive)
    const exactMatch = data.coins?.find(
      (coin: any) => coin.symbol.toLowerCase() === symbol.toLowerCase()
    );

    return exactMatch?.id || null;
  } catch (error) {
    console.error('Error searching token by symbol:', error);
    return null;
  }
}

/**
 * Get token market data by CoinGecko ID
 */
export async function getTokenData(coinId: string): Promise<CoinGeckoToken | null> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      {
        headers: {
          'accept': 'application/json',
          'x-cg-demo-api-key': COINGECKO_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching token data:', error);
    return null;
  }
}

/**
 * Get 24-hour price chart data for a token
 */
export async function getTokenPriceChart(coinId: string): Promise<PriceChartData | null> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=1&interval=hourly`,
      {
        headers: {
          'accept': 'application/json',
          'x-cg-demo-api-key': COINGECKO_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching price chart:', error);
    return null;
  }
}

/**
 * Get comprehensive token data and chart for a symbol
 */
export async function getTokenDataAndChart(symbol: string): Promise<TokenChartData | null> {
  try {
    // First, search for the token by symbol
    const coinId = await searchTokenBySymbol(symbol);
    
    if (!coinId) {
      console.warn(`Token with symbol ${symbol} not found on CoinGecko`);
      return null;
    }

    // Get token data and price chart in parallel
    const [tokenData, chartData] = await Promise.all([
      getTokenData(coinId),
      getTokenPriceChart(coinId)
    ]);

    if (!tokenData || !chartData) {
      return null;
    }

    // Process chart data
    const prices = chartData.prices.map(([timestamp, price]) => ({
      timestamp,
      price,
      formattedTime: new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }));

    const currentPrice = tokenData.current_price;
    const priceChange24h = tokenData.price_change_24h;
    const priceChangePercentage24h = tokenData.price_change_percentage_24h;
    const isPositive = priceChangePercentage24h >= 0;

    return {
      prices,
      currentPrice,
      priceChange24h,
      priceChangePercentage24h,
      isPositive
    };
  } catch (error) {
    console.error('Error fetching token data and chart:', error);
    return null;
  }
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  if (price >= 1) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } else if (price >= 0.01) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    });
  } else {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6
    });
  }
}

/**
 * Format percentage change
 */
export function formatPercentageChange(percentage: number): string {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
} 