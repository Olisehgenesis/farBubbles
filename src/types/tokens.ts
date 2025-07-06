export interface Token {
  address: string;
  name: string;
  symbol: string;
  chainId: number;
  decimals: number;
  logoURI: string;
}

export interface TokenList {
  name: string;
  logoURI: string;
  keywords: string[];
  timestamp: string;
  tokens: Token[];
  version: {
    major: number;
    minor: number;
    patch: number;
  };
} 