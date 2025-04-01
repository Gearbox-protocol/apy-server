import type { Address } from "viem";

import type { NetworkType } from "../../utils";

const ezETH = {
  symbol: "ezETH",
  apy: 3.79,
};
const rsETH = {
  symbol: "rsETH",
  apy: 3.6,
};
const weETH = {
  symbol: "weETH",
  apy: 3.7,
};
const rswETH = {
  symbol: "rswETH",
  apy: 2.77,
};
const pufETH = {
  symbol: "pufETH",
  apy: 2.78,
};

export const TOKENS: Record<
  NetworkType,
  Record<Address, { symbol: string; apy: number }>
> = {
  Mainnet: {
    "0xbf5495Efe5DB9ce00f80364C8B423567e58d2110": ezETH,
    "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7": rsETH,
    "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee": weETH,
    "0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0": rswETH,
    "0xD9A442856C234a39a81a089C06451EBAa4306a72": pufETH,
  },
  Optimism: {
    "0x2416092f143378750bb29b79eD961ab195CcEea5": ezETH,
  },
  Arbitrum: {
    "0x2416092f143378750bb29b79eD961ab195CcEea5": ezETH,
    "0x4186BFC76E2E237523CBC30FD220FE055156b41F": rsETH,
    "0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe": weETH,
  },
  Base: {},
  Sonic: {},
} as const;

export const PROTOCOL = "constant";
