import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";

export const TOKENS: Record<NetworkType, { csUSDL?: Address }> = {
  Mainnet: { csUSDL: "0xbEeFc011e94f43b8B7b455eBaB290C7Ab4E216f1" },
  Optimism: {},
  Arbitrum: {},
  Base: {},
  Sonic: {},

  Monad: {},
  MegaETH: {},
  Berachain: {},
  Avalanche: {},
  BNB: {},
  WorldChain: {},
  Etherlink: {},
};

export const PROTOCOL = "coinshift";
