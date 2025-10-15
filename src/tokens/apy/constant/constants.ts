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
    "0xe72b141df173b999ae7c1adcbf60cc9833ce56a8": {
      symbol: "ETHPlus",
      apy: 2.81,
    },
  },

  Arbitrum: {},
  Etherlink: {
    "0x733d504435a49FC8C4e9759e756C2846c92f0160": {
      apy: 21.16,
      symbol: "mRe7YIELD",
    },
  },
};

export const PROTOCOL = "constant";
