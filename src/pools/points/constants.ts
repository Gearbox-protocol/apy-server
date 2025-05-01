import type { Address } from "viem";

import type { NetworkType } from "../../core/chains";

export type PoolPointsResult = Record<Address, Array<PoolPointsInfo>>;
export type PoolPointsHandler = (
  network: NetworkType,
) => Promise<PoolPointsResult>;

export interface PoolPointsInfo {
  pool: Address;
  token: Address;
  symbol: string;

  amount: bigint;
  duration: string;
  name: string;
  estimation: "absolute" | "relative";
}

const WETH_V3_TRADE_ETH: Address = "0xda0002859b2d05f66a753d8241fcde8623f26f4f";
const RSETH_ETH: Address = "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7";

const WBTC_V3_TRADE_ETH: Address = "0xda00010eda646913f273e10e7a5d1f659242757d";
const LBTC_ETH: Address = "0x8236a87084f8B84306f72007F36F2618A5634494";
const PUMPBTC_ETH: Address = "0xF469fBD2abcd6B9de8E169d128226C0Fc90a012e";

const WC_V3_SONIC = "0xcf4d737c38ef2ac9c7bdb4dbbc954b1932ea4a40";
const USDC_E_V3_SONIC = "0x6F6bda069FB05baB5E83B22FbDb54CBdF33f78ee";

const WS_SONIC = "0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38";
const USDC_E = "0x29219dd400f2Bf60E5a23d13Be72B486D4038894";

export const POOL_POINTS: Record<NetworkType, Array<PoolPointsInfo>> = {
  Mainnet: [
    {
      pool: WETH_V3_TRADE_ETH,
      token: RSETH_ETH,
      symbol: "rsETH",

      amount: 7500n * 10000n,
      duration: "hour",
      name: "Kelp Mile",
      estimation: "relative",
    },

    {
      pool: WBTC_V3_TRADE_ETH,
      token: LBTC_ETH,
      symbol: "LBTC",

      amount: 2000n * 10000n,
      duration: "day",
      name: "Lombard LUX",
      estimation: "absolute",
    },
    {
      pool: WBTC_V3_TRADE_ETH,
      token: PUMPBTC_ETH,
      symbol: "pumpBTC",

      amount: 172_800n * 10000n,
      duration: "day",
      name: "Pump BTC",
      estimation: "absolute",
    },
  ],
  Arbitrum: [],
  Optimism: [],
  Base: [],
  Sonic: [
    {
      pool: USDC_E_V3_SONIC,
      token: USDC_E,
      symbol: "USDC_e",

      amount: 10n * 10000n,
      duration: "day",
      name: "Sonic points",
      estimation: "absolute",
    },
    {
      pool: WC_V3_SONIC,
      token: WS_SONIC,
      symbol: "wS",

      amount: 8n * 10000n,
      duration: "day",
      name: "Sonic points",
      estimation: "absolute",
    },
  ],

  Monad: [],
  MegaETH: [],
  Berachain: [],
  Avalanche: [],
  BNB: [],
  WorldChain: [],
};
