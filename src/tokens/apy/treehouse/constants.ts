import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";

export const TOKENS: Record<NetworkType, { tETH?: Address }> = {
  Mainnet: {
    tETH: "0xD11c452fc99cF405034ee446803b6F6c1F6d5ED8",
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

export const PROTOCOL = "treehouse";
