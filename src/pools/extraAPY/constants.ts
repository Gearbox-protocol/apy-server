import type { PoolExtraApy } from "@gearbox-protocol/sdk/rewards";
import type { Address } from "viem";

export type { PoolExtraApy };

export type PoolExtraAPYResult = Record<Address, Array<PoolExtraApy>>;
export type PoolExtraAPYResultByChain = Record<number, PoolExtraAPYResult>;
export type PoolExtraAPYHandler = () => Promise<PoolExtraAPYResultByChain>;

export const BROKEN_CAMPAIGNS: Record<string, boolean> = {
  "11136065905617273958": true,
};
