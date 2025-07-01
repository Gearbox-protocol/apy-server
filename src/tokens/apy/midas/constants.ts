import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";

export const TOKENS: Record<
  NetworkType,
  { mBASIS?: Address; mTBILL?: Address }
> = {
  Mainnet: {},
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
  Etherlink: {
    mTBILL: "0xdd629e5241cbc5919847783e6c96b2de4754e438",
    mBASIS: "0x2247b5a46bb79421a314ab0f0b67ffd11dd37ee4",
  },
};

export const PROTOCOL = "midas";
