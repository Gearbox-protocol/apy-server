import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";
import type { PartialRecord } from "../../../core/utils";
import type { APYHandler } from "../constants";
import { getAPYMidas } from "../midas";
import { TOKENS as TOKENS_MIDAS } from "../midas/constants";
import { getAPYYieldsreserve } from "../yieldsreserve";
import { TOKENS as TOKENS_YIELDRESERVE } from "../yieldsreserve/constants";

export const PROTOCOL = "merkle.xyz";

export interface CommonPayload {
  id: Address;
  symbol: string;
  type: "common";
}

export interface CompositePart {
  handler:
    | { getter: APYHandler; type: "midas" }
    | { getter: APYHandler; type: "yieldsreserve" };
  token: Address;
  fraction: number;
}

export interface CompositePayload {
  id: Address;
  symbol: string;
  type: "composite";
  tokens: Array<CompositePart>;
}

export const TOKENS: PartialRecord<
  NetworkType,
  Record<Address, CommonPayload | CompositePayload> // symbol to pool
> = {
  Mainnet: {
    "0xe72b141df173b999ae7c1adcbf60cc9833ce56a8": {
      id: "0x9ebe8c8e7a8d00b6085302e78cdba319932898c7",
      symbol: "ETHPlus",
      type: "composite",
      tokens: [
        {
          handler: { getter: getAPYYieldsreserve, type: "yieldsreserve" },
          token:
            TOKENS_YIELDRESERVE.Mainnet?.["ETH+"]?.address || ("" as Address),
          fraction: 1,
        },
      ],
    },
  },
  Etherlink: {
    "0x942644106B073E30D72c2C5D7529D5C296ea91ab": {
      id: "0x942644106B073E30D72c2C5D7529D5C296ea91ab",
      symbol: "mTBILLUSDC",
      type: "composite",
      tokens: [
        {
          handler: { getter: getAPYMidas, type: "midas" },
          token: TOKENS_MIDAS.Etherlink?.mTBILL || ("" as Address),
          fraction: 0.5,
        },
      ],
    },
    "0x0714027E44802b2Ff76389daF5371990CC3a4C24": {
      id: "0x0714027E44802b2Ff76389daF5371990CC3a4C24",
      symbol: "mBASISUSDC",
      type: "composite",
      tokens: [
        {
          handler: { getter: getAPYMidas, type: "midas" },
          token: TOKENS_MIDAS.Etherlink?.mBASIS || ("" as Address),
          fraction: 0.5,
        },
      ],
    },
    "0x5D37F9B272ca7cdA2A05245b9a503746EefAC88f": {
      id: "0x5D37F9B272ca7cdA2A05245b9a503746EefAC88f",
      symbol: "mRE7USDC",
      type: "composite",
      tokens: [
        {
          handler: { getter: getAPYMidas, type: "midas" },
          token: TOKENS_MIDAS.Etherlink?.mRe7YIELD || ("" as Address),
          fraction: 0.5,
        },
      ],
    },
  },
  Plasma: {
    "0x2d84d79c852f6842abe0304b70bbaa1506add457": {
      id: "0x2d84d79c852f6842abe0304b70bbaa1506add457",
      symbol: "USDT0USDe",
      type: "common",
    },
    "0x1e8d78e9b3f0152d54d32904b7933f1cfe439df1": {
      id: "0x1e8d78e9b3f0152d54d32904b7933f1cfe439df1",
      symbol: "USDT0sUSDe",
      type: "common",
    },
  },
  Monad: {
    "0x942644106B073E30D72c2C5D7529D5C296ea91ab": {
      id: "0x942644106B073E30D72c2C5D7529D5C296ea91ab",
      symbol: "AUSDCT0",
      type: "common",
    },
  },
};
