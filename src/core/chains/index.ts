export const supportedChains = [
  "Mainnet",
  "Arbitrum",
  "Optimism",
  "Base",
  "Sonic",

  "MegaETH",
  "Monad",
  "Berachain",
  "Avalanche",
] as const;

export type NetworkType = (typeof supportedChains)[number];
const CHAINS = {
  Mainnet: 1,
  Arbitrum: 42161,
  Optimism: 10,
  Base: 8453,
  Sonic: 146,

  Monad: 10_143,
  MegaETH: 6342,
  Berachain: 80094,
  Avalanche: 43_114,
};

export function getChainId(network: NetworkType) {
  return CHAINS[network];
}

export function isSupportedNetwork(chainId: number) {
  return Object.values(CHAINS).includes(chainId);
}
