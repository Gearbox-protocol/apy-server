import type { Address } from "viem";
export interface ApyDetails {
  reward: Address;
  symbol: string;
  value: number;
  lastUpdated?: string;
  protocol?: string;
}

export const supportedChains = ["Mainnet", "Arbitrum", "Optimism"] as const;
export type NetworkType = (typeof supportedChains)[number];
export const CHAINS = {
  Mainnet: 1,
  Arbitrum: 42161,
  Optimism: 10,
};
export const NOT_DEPLOYED = "0xNOT DEPLOYED";

export function isSupportedNetwork(chainId: number) {
  return Object.values(CHAINS).includes(chainId);
}
export interface TokenAPY {
  symbol: string;
  apys: ApyDetails[];
}

export const PERCENTAGE_DECIMALS = 100;

export function getTokenAPY(sym: string, apys: ApyDetails[]) {
  return {
    symbol: sym,
    apys: apys,
  };
}
export type APYResult = Record<Address, TokenAPY>;
