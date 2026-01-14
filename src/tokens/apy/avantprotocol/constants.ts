import type { NetworkType } from "@gearbox-protocol/sdk";
import type { Address } from "viem";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<NetworkType, { savUSD?: Address }> = {
  Plasma: {
    savUSD: "0xa29420057f3e3b9512d4786df135da1674bd74d4",
  },
};

export const PROTOCOL = "avantprotocol";
