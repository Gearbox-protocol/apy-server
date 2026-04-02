import type {
  PoolOutputDetails as PoolOutputDetailsSDK,
  TokenOutputDetails as TokenOutputDetailsSDK,
} from "@gearbox-protocol/sdk/rewards";
import type { Address } from "viem";
import type { PointsType } from "../../tokens/points";

type TokenOutputDetails = TokenOutputDetailsSDK<PointsType>;
type PoolOutputDetails = PoolOutputDetailsSDK<PointsType>;

export type { TokenOutputDetails, PoolOutputDetails };

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
