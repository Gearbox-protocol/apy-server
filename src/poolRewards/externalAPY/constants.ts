import type { Address } from "viem";

import type { NetworkType } from "../../utils";

export interface ExternalApy {
  value: number;
  name: string;

  pool: Address;
}

export type PoolExternalAPYResult = Record<Address, Array<ExternalApy>>;
export type PoolExternalAPYHandler = (
  network: NetworkType,
) => Promise<PoolExternalAPYResult>;

const WETH_V3_GHO_ETH: Address = "0x4d56c9cba373ad39df69eb18f076b7348000ae09";

export const POOL_EXTERNAL_APY: Record<NetworkType, Array<ExternalApy>> = {
  Mainnet: [
    {
      value: 6,
      name: "Royco",
      pool: WETH_V3_GHO_ETH,
    },
  ],
  Arbitrum: [],
  Optimism: [],
  Base: [],
  Sonic: [],

  Monad: [],
  MegaETH: [],
  Berachain: [],
  Avalanche: [],
};
