import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";
import type { PartialRecord } from "../../../core/utils";

export const PROTOCOL = "merkle.xyz";

export const TOKENS: PartialRecord<
  NetworkType,
  Record<Address, { id: Address; symbol: string }> // symbol to pool
> = {
  Etherlink: {
    "0x942644106B073E30D72c2C5D7529D5C296ea91ab": {
      id: "0x942644106B073E30D72c2C5D7529D5C296ea91ab",
      symbol: "mTBILLUSDC",
    },
    "0x0714027E44802b2Ff76389daF5371990CC3a4C24": {
      id: "0x0714027E44802b2Ff76389daF5371990CC3a4C24",
      symbol: "mBASISUSDC",
    },
    "0x5D37F9B272ca7cdA2A05245b9a503746EefAC88f": {
      id: "0x5D37F9B272ca7cdA2A05245b9a503746EefAC88f",
      symbol: "mRE7USDC",
    },
  },
};
