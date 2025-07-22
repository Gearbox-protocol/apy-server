import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<
  NetworkType,
  { sUSDS?: Address; stkUSDS?: Address }
> = {
  Mainnet: {
    sUSDS: "0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD",
    stkUSDS: "0xcB5D10A57Aeb622b92784D53F730eE2210ab370E",
  },
};

export const PROTOCOL = "sky";
