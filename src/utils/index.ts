export const supportedChains = [
  "Mainnet",
  "Arbitrum",
  "Optimism",
  "Base",
  "Sonic",
] as const;
export type NetworkType = (typeof supportedChains)[number];
const CHAINS = {
  Mainnet: 1,
  Arbitrum: 42161,
  Optimism: 10,
  Base: 8453,
  Sonic: 146,
};

export function getChainId(network: NetworkType) {
  return CHAINS[network];
}

export function isSupportedNetwork(chainId: number) {
  return Object.values(CHAINS).includes(chainId);
}

export function toJSONWithBigint(o: any) {
  const r = JSON.stringify(o, (_, v) =>
    typeof v === "bigint" ? v.toString() : v,
  );

  return r;
}
