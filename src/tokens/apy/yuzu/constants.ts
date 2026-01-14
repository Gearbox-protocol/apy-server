import type { NetworkType } from "@gearbox-protocol/sdk";
import type { Address } from "viem";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<NetworkType, { syzUSD?: Address }> = {
  Plasma: {
    syzUSD: "0xc8a8df9b210243c55d31c73090f06787ad0a1bf6",
  },
};

export const PROTOCOL = "yuzu";
