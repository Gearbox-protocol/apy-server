import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";

const rsETH = {
  symbol: "rsETH",
  apy: 3.5,
};
const rswETH = {
  symbol: "rswETH",
  apy: 1.8,
};
const pufETH = {
  symbol: "pufETH",
  apy: 3.47,
};

export const TOKENS: Record<
  NetworkType,
  Record<Address, { symbol: string; apy: number }>
> = {
  Mainnet: {
    "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7": rsETH,
    "0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0": rswETH,
    "0xD9A442856C234a39a81a089C06451EBAa4306a72": pufETH,
  },
  Optimism: {},
  Arbitrum: {
    "0x4186BFC76E2E237523CBC30FD220FE055156b41F": rsETH,
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

export const PROTOCOL = "constant";
