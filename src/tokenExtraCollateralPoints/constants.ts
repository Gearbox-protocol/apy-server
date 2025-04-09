import type { Address } from "viem";

import type { PointsInfo } from "../points";
import { REWARDS_BASE_INFO } from "../points";
import type { NetworkType } from "../utils";

export type TokenExtraCollateralPointsResult = Record<
  Address,
  ExtraCollateralPointsInfo
>;
export type ExtraCollateralPointsHandler = (
  network: NetworkType,
) => Promise<TokenExtraCollateralPointsResult>;

export interface ExtraCollateralPointsInfo extends PointsInfo {
  pool: Address;
}

export const POINTS_INFO_BY_NETWORK: Record<
  NetworkType,
  Array<ExtraCollateralPointsInfo>
> = {
  Mainnet: [
    {
      pool: "0xff94993fa7ea27efc943645f95adb36c1b81244b",
      address: "0x7a4EffD87C2f3C55CA251080b1343b605f327E3a",
      symbol: "rstETH",
      rewards: [
        REWARDS_BASE_INFO.symbiotic(35n),
        REWARDS_BASE_INFO.mellow(70n),
      ],
    },
  ],
  Arbitrum: [],
  Optimism: [],
  Base: [],
  Sonic: [],
};
