import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<NetworkType, { stS?: Address }> = {
  Sonic: {
    stS: "0xE5DA20F15420aD15DE0fa650600aFc998bbE3955",
  },
};

export const PROTOCOL = "beets";
