import type { Address } from "viem";

import type { Apy } from "../apy";
import type { NetworkType } from "../utils";

export interface ExtraCollateralAPY extends Omit<Apy, "protocol"> {
  pool: Address;
  type: "relative" | "absolute";
}

export type TokenExtraCollateralAPYResult = Record<
  Address,
  Array<ExtraCollateralAPY>
>;
export type TokenExtraCollateralAPYHandler = (
  network: NetworkType,
) => Promise<TokenExtraCollateralAPYResult>;

export const EXTRA_APY: Record<NetworkType, Array<ExtraCollateralAPY>> = {
  Mainnet: [
    {
      pool: "0xff94993fa7ea27efc943645f95adb36c1b81244b", // WSTETH_POOL
      address: "0x7a4EffD87C2f3C55CA251080b1343b605f327E3a", // RSTETH
      symbol: "rstETH",
      value: 1,
      type: "relative",
    },
  ],
  Optimism: [],
  Arbitrum: [],
  Base: [],
  Sonic: [],
};
