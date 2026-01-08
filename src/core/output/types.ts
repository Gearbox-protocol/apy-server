import type { DataResult, GearAPYDetails } from "../app/fetcher";
import type { PoolOutputDetails, TokenOutputDetails } from "../app/types";

export interface IOutputWriter {
  write: (data: unknown) => Promise<void>;
}

export interface Output {
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
