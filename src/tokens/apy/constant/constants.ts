import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";
import type { PartialRecord } from "../../../core/utils";

const pufETH = {
  symbol: "pufETH",
  apy: 2.31,
};

export const TOKENS: PartialRecord<
  NetworkType,
  Record<Address, { symbol: string; apy: number }>
> = {
  Mainnet: {
    "0xD9A442856C234a39a81a089C06451EBAa4306a72": pufETH,
  },

  Arbitrum: {},
  Etherlink: {},
};

export const PROTOCOL = "constant";
