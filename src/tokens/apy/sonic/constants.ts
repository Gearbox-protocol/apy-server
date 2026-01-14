import type { NetworkType } from "@gearbox-protocol/sdk";
import type { Address } from "viem";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<NetworkType, { stS?: Address }> = {
  Sonic: {
    stS: "0xE5DA20F15420aD15DE0fa650600aFc998bbE3955",
  },
};

export const PROTOCOL = "beets";
