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
  "BNB",
  "WorldChain",
  "Etherlink",
  "Hemi",
  "Lisk",
  "Plasma",
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
  BNB: 56,
  WorldChain: 480,
  Etherlink: 42793,

  Lisk: 1135,
  Hemi: 43111,

  Plasma: 9745,
};

export function getChainId(network: NetworkType) {
  return CHAINS[network];
}

const CHAIN_BY_ID = (
  Object.entries(CHAINS) as Array<[NetworkType, number]>
).reduce<Record<number, NetworkType>>((acc, [network, chainId]) => {
  acc[chainId] = network;
  return acc;
}, {});

export function isSupportedNetwork(chainId: number) {
  return CHAIN_BY_ID[chainId] !== undefined;
}

export function getNetworkType(
  chainId: number | bigint | string,
): NetworkType | undefined {
  return CHAIN_BY_ID[Number(chainId)];
}
