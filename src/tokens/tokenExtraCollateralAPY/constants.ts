import type { NetworkType } from "@gearbox-protocol/sdk";
import type { Address } from "viem";
import type { PartialRecord } from "../../core/utils";
import { type Apy, getAPYMerkle_withFilter } from "../apy";

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

interface ExtraCollateralAPYPayload extends Omit<ExtraCollateralAPY, "value"> {
  value: { getter: (network: NetworkType) => Promise<number> };
}

const ETHPlus = "0xE72B141DF173b999AE7c1aDcbF60Cc9833Ce56a8";

export const EXTRA_APY: PartialRecord<
  NetworkType,
  Array<ExtraCollateralAPYPayload>
> = {
  Mainnet: [
    {
      pool: "0x9396dcbf78fc526bb003665337c5e73b699571ef", // kpk WETH
      address: ETHPlus, // ETH+
      symbol: "ETH+",
      value: {
        getter: async network => {
          const r = await getAPYMerkle_withFilter(network, [
            [
              ETHPlus,
              {
                id: "0x9ebe8c8e7a8d00b6085302e78cdba319932898c7",
                symbol: "ETHPlus",
                type: "common",
              },
            ],
          ]);
          return r[ETHPlus]?.apys[0]?.value || 0;
        },
      },
      type: "relative",
    },
  ],
};
