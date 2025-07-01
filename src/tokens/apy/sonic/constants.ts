import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";

export const TOKENS: Record<NetworkType, { stS?: Address }> = {
  Mainnet: {},
  Optimism: {},
  Arbitrum: {},
  Base: {},
  Sonic: {
    stS: "0xE5DA20F15420aD15DE0fa650600aFc998bbE3955",
  },

  Monad: {},
  MegaETH: {},
  Berachain: {},
  Avalanche: {},
  BNB: {},
  WorldChain: {},
  Etherlink: {},
};

export const PROTOCOL = "beets";
