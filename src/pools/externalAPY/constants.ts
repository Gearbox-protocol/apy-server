import type { Address } from "viem";

import type { NetworkType } from "../../core/chains";
import type { PartialRecord } from "../../core/utils";

export interface ExternalApy {
  value: number;
  name: string;

  pool: Address;
}

export type PoolExternalAPYResult = Record<Address, Array<ExternalApy>>;
export type PoolExternalAPYHandler = (
  network: NetworkType,
) => Promise<PoolExternalAPYResult>;

const edgeUSDC: Address = "0x6b343f7b797f1488aa48c49d540690f2b2c89751";

export const POOL_EXTERNAL_APY: PartialRecord<
  NetworkType,
  Array<ExternalApy>
> = {
  Mainnet: [
    {
      value: 110,
      name: "MON via Merkl",
      pool: edgeUSDC,
    },
  ],
};
