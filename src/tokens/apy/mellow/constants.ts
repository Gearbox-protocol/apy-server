import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";

export const TOKENS: Record<NetworkType, { DVstETH?: Address }> = {
  Mainnet: {
    DVstETH: "0x5E362eb2c0706Bd1d134689eC75176018385430B",
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

export const PROTOCOL = "mellow";
