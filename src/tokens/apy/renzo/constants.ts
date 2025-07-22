import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<
  NetworkType,
  { ezETH?: Address; pzETH?: Address }
> = {
  Mainnet: {
    ezETH: "0xbf5495Efe5DB9ce00f80364C8B423567e58d2110",
    pzETH: "0x8c9532a60E0E7C6BbD2B2c1303F63aCE1c3E9811",
  },
  Optimism: {
    ezETH: "0x2416092f143378750bb29b79eD961ab195CcEea5",
  },
  Arbitrum: {
    ezETH: "0x2416092f143378750bb29b79eD961ab195CcEea5",
  },
};

export const PROTOCOL = "renzo";
