import type { Address } from "viem";

import type { ApyDetails, GearAPYDetails } from "../../fetcher";
import type { ExternalApy } from "../../pools";
import type { PoolPointsInfo } from "../../pools/points";
import type { PointsInfo } from "../../tokens/points";
import type { ExtraCollateralAPY } from "../../tokens/tokenExtraCollateralAPY";
import type { ExtraCollateralPointsInfo } from "../../tokens/tokenExtraCollateralPoints";
import type { FarmInfo } from "../../tokens/tokenExtraRewards";

export interface Response {
  status: "error" | "ok";
  description?: string;
  data?:
    | Array<TokenOutputDetails>
    | TokenOutputDetails
    | Array<PoolOutputDetails>
    | PoolOutputDetails
    | GearAPYDetails;
}

export interface TokenOutputDetails {
  chainId: number;
  address: string;
  symbol: string;
  rewards: {
    apy: Array<Omit<ApyDetails, "symbol" | "address">>;
    points: Array<Omit<PointsInfo, "symbol" | "address">>;
    extraRewards: Array<Omit<FarmInfo, "symbol" | "address">>;
    extraCollateralAPY: Array<Omit<ExtraCollateralAPY, "symbol" | "address">>;
    extraCollateralPoints: Array<
      Omit<ExtraCollateralPointsInfo, "symbol" | "address">
    >;
  };
}

export interface PoolOutputDetails {
  chainId: number;
  pool: Address;

  rewards: {
    points: Array<Omit<PoolPointsInfo, "pool">>;
    externalAPY: Array<Omit<ExternalApy, "pool">>;
  };
}

export function removeSymbolAndAddress<
  T extends { address: Address; symbol: string },
>(l: Array<T>): Array<Omit<T, "address" | "symbol">> {
  return l.map(({ symbol, address, ...rest }) => rest);
}

export function removePool<T extends { pool: Address }>(
  l: Array<T>,
): Array<Omit<T, "pool">> {
  return l.map(({ pool, ...rest }) => rest);
}
