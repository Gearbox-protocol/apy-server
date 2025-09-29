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
  Record<
    Address,
    {
      id: Address;
      symbol: string;
      field: keyof PendleResponse;
      chainId: number;
    }
  > // symbol to pool
> = {
  Mainnet: {
    "0x9D39A5DE30e57443BfF2A8307A4256c8797A3497": {
      id: "0xcdd26eb5eb2ce0f203a84553853667ae69ca29ce",
      symbol: "sUSDe",
      field: "underlyingInterestApy",
      chainId: 1,
    },
  },
  Plasma: {
    "0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2": {
      id: "0xcdd26eb5eb2ce0f203a84553853667ae69ca29ce",
      symbol: "sUSDe",
      field: "underlyingInterestApy",
      chainId: 1,
    },

    "0x0b2b2b2076d95dda7817e785989fe353fe955ef9": {
      id: "0x43023675c804a759cbf900da83dbcc97ee2afbe7",
      symbol: "sUSDai",
      field: "underlyingApy",
      chainId: 42161,
    },
  },
};
