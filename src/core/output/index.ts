import type { DataResult } from "../../server/controllers/rewards/data";
import type { GearAPYDetails } from "../app/fetcher";
import type { PoolOutputDetails, TokenOutputDetails } from "../server";

export interface OutputWriter {
  write: (data: unknown) => Promise<void>;
}

export interface OneShotOutput {
  gearApy: DataResult<GearAPYDetails>;
  chains: Record<
    string,
    {
      tokens: DataResult<TokenOutputDetails[]>;
      pools: DataResult<PoolOutputDetails[]>;
    }
  >;
  timestamp: string;
  metadata: {
    totalChains: number;
    successfulChains: number;
    failedChains: number;
  };
}
