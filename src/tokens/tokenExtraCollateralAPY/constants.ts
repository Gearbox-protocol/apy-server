import type { NetworkType } from "@gearbox-protocol/sdk";
import type { Address } from "viem";
import type { PartialRecord } from "../../core/utils";
import type { Apy } from "../apy";

export interface ExtraCollateralAPY extends Omit<Apy, "protocol"> {
  pool: Address;
  // absolute apy completely replaces apy value of token for given pool
  // relative apy adds to the apy value of token for given pool
  type: "relative" | "absolute";
}

export type TokenExtraCollateralAPYResult = Record<
  Address,
  Array<ExtraCollateralAPY>
>;
export type TokenExtraCollateralAPYHandler = (
  network: NetworkType,
) => Promise<TokenExtraCollateralAPYResult>;

export const EXTRA_APY: PartialRecord<
  NetworkType,
  Array<ExtraCollateralAPY>
> = {
  Mainnet: [
    {
      pool: "0x9396dcbf78fc526bb003665337c5e73b699571ef", // kpk WETH
      address: "0xE72B141DF173b999AE7c1aDcbF60Cc9833Ce56a8", // ETH+
      symbol: "ETH+",
      value: 1.25,
      type: "relative",
    },
  ],
};
