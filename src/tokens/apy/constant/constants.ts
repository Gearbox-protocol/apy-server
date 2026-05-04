import type { NetworkType } from "@gearbox-protocol/sdk";
import type { Address } from "viem";
import type { PartialRecord } from "../../../core/utils";

const pufETH = {
  symbol: "pufETH",
  apy: 2.31,
};

const STAC = {
  symbol: "STAC",
  apy: 4.9,
};

const ACRED = {
  symbol: "ACRED",
  apy: 8,
};

export const TOKENS: PartialRecord<
  NetworkType,
  Record<Address, { symbol: string; apy: number }>
> = {
  Mainnet: {
    "0xD9A442856C234a39a81a089C06451EBAa4306a72": pufETH,
    "0x51C2d74017390CbBd30550179A16A1c28F7210fc": STAC,
    "0x17418038ecF73BA4026c4f428547BF099706F27B": ACRED,
  },

  Arbitrum: {},
  Etherlink: {},
};

export const PROTOCOL = "constant";
