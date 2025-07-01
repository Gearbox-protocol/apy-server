import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";

export const TOKENS: Record<
  NetworkType,
  { sUSDS?: Address; stkUSDS?: Address }
> = {
  Mainnet: {
    sUSDS: "0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD",
    stkUSDS: "0xcB5D10A57Aeb622b92784D53F730eE2210ab370E",
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

export const PROTOCOL = "sky";
