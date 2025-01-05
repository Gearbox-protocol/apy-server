import type { Address } from "viem";

export interface Apy {
  reward: Address;
  symbol: string;
  protocol: string;

  value: number;
}

export interface TokenAPY<A = Apy> {
  address: Address;
  symbol: string;

  apys: Array<A>;
}

export type APYResult = Record<Address, TokenAPY>;

export type APYHandler = (network: NetworkType) => Promise<APYResult>;

export const supportedChains = ["Mainnet", "Arbitrum", "Optimism"] as const;
export type NetworkType = (typeof supportedChains)[number];
const CHAINS = {
  Mainnet: 1,
  Arbitrum: 42161,
  Optimism: 10,
};

export function getChainId(network: NetworkType) {
  return CHAINS[network];
}

export function isSupportedNetwork(chainId: number) {
  return Object.values(CHAINS).includes(chainId);
}
