import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";
import type { PartialRecord } from "../../../core/utils";

export const PROTOCOL = "pendle";

export interface PendleResponse {
  underlyingApy: number;
  underlyingInterestApy: number;
}

export const TOKENS: PartialRecord<
  NetworkType,
  Record<Address, { id: Address; symbol: string; field: keyof PendleResponse }> // symbol to pool
> = {
  Plasma: {
    "0x0b2b2b2076d95dda7817e785989fe353fe955ef9": {
      id: "0x43023675c804a759cbf900da83dbcc97ee2afbe7",
      symbol: "sUSDai",
      field: "underlyingApy",
    },
  },
};
