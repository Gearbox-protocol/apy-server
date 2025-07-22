import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<NetworkType, { csUSDL?: Address }> = {
  Mainnet: { csUSDL: "0xbEeFc011e94f43b8B7b455eBaB290C7Ab4E216f1" },
};

export const PROTOCOL = "coinshift";
