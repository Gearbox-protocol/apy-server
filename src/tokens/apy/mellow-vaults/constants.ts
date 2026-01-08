import type { NetworkType } from "@gearbox-protocol/sdk";
import type { Address } from "viem";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<NetworkType, { lskETH?: Address }> = {
  Lisk: {
    lskETH: "0x1b10E2270780858923cdBbC9B5423e29fffD1A44",
  },
};

export const PROTOCOL = "mellow";
