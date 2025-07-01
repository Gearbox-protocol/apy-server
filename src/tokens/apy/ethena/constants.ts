import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";

export const TOKENS: Record<NetworkType, { sUSDe?: Address }> = {
  Mainnet: {
    sUSDe: "0x9D39A5DE30e57443BfF2A8307A4256c8797A3497",
  },
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

export const PROTOCOL = "ethena";
