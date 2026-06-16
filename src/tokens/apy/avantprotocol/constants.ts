import type { NetworkType } from "@gearbox-protocol/sdk";
import type { Address } from "viem";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<
  NetworkType,
  { savUSD?: Address; savETH?: Address }
> = {
  Plasma: {
    savUSD: "0xa29420057f3e3b9512d4786df135da1674bd74d4",
  },
  Mainnet: {
    savUSD: "0xb8d89678e75a973e74698c976716308abb8a46a4",
    savETH: "0xda06ee2dacf9245aa80072a4407debdea0d7e341",
  },
};

export const PROTOCOL = "avantprotocol";
