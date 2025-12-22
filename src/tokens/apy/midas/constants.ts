import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<
  NetworkType,
  { mBASIS?: Address; mTBILL?: Address; mRe7YIELD?: Address; mEDGE?: Address }
> = {
  Etherlink: {
    mTBILL: "0xdd629e5241cbc5919847783e6c96b2de4754e438",
    mBASIS: "0x2247b5a46bb79421a314ab0f0b67ffd11dd37ee4",
    mRe7YIELD: "0x733d504435a49fc8c4e9759e756c2846c92f0160",
  },
  Monad: {
    mEDGE: "0x1c8eE940B654bFCeD403f2A44C1603d5be0F50Fa",
  },
};

export const PROTOCOL = "midas";
