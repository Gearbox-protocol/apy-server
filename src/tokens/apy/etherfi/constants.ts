import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";

export const TOKENS: Record<NetworkType, { weETH?: Address }> = {
  Mainnet: {
    weETH: "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee",
  },
  Optimism: {},
  Arbitrum: {
    weETH: "0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe",
  },
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

export const PROTOCOL = "etherfi";
