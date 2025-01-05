import type { Address } from "viem";

import type { NetworkType } from "../../utils";

export const TOKENS: Record<
  NetworkType,
  Record<Address, { symbol: string; apy: number }>
> = {
  Mainnet: {
    "0xbf5495Efe5DB9ce00f80364C8B423567e58d2110": {
      symbol: "ezETH",
      apy: 3.91,
    },
    "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7": {
      symbol: "rsETH",
      apy: 4.6,
    },
    "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee": {
      symbol: "weETH",
      apy: 4.23,
    },
    "0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0": {
      symbol: "rswETH",
      apy: 4.89,
    },
    "0xD9A442856C234a39a81a089C06451EBAa4306a72": {
      symbol: "pufETH",
      apy: 5.57,
    },
  },
  Optimism: {
    "0x2416092f143378750bb29b79eD961ab195CcEea5": {
      symbol: "ezETH",
      apy: 3.91,
    },
  },
  Arbitrum: {
    "0x2416092f143378750bb29b79eD961ab195CcEea5": {
      symbol: "ezETH",
      apy: 3.91,
    },
    "0x4186BFC76E2E237523CBC30FD220FE055156b41F": {
      symbol: "rsETH",
      apy: 4.6,
    },
    "0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe": {
      symbol: "weETH",
      apy: 4.23,
    },
  },
} as const;

export const PROTOCOL = "constant";
