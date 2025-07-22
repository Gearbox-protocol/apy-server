import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<NetworkType, { sUSDe?: Address }> = {
  Mainnet: {
    sUSDe: "0x9D39A5DE30e57443BfF2A8307A4256c8797A3497",
  },
};

export const PROTOCOL = "ethena";
