import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<
  NetworkType,
  { mBASIS?: Address; mTBILL?: Address; mRe7YIELD?: Address }
> = {
  Etherlink: {
    mTBILL: "0xdd629e5241cbc5919847783e6c96b2de4754e438",
    mBASIS: "0x2247b5a46bb79421a314ab0f0b67ffd11dd37ee4",
    mRe7YIELD: "0x733d504435a49fc8c4e9759e756c2846c92f0160",
  },
};

export const PROTOCOL = "midas";
