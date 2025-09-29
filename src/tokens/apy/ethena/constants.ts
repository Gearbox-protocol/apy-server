import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<NetworkType, { sUSDe?: Address }> = {
  Mainnet: {
    sUSDe: "0x9D39A5DE30e57443BfF2A8307A4256c8797A3497",
  },
  Plasma: {
    sUSDe: "0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2",
  },
};

export const PROTOCOL = "ethena";
