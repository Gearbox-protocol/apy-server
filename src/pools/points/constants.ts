import type { Address } from "viem";

import type { NetworkType } from "../../core/chains";
import type { PartialRecord } from "../../core/utils";
import type { PointsType } from "../../tokens/points";
import { REWARDS_BASE_INFO } from "../../tokens/points";

export type PoolPointsResult = Record<Address, Array<PoolPointsInfo>>;
export type PoolPointsHandler = (
  network: NetworkType,
) => Promise<PoolPointsResult>;

export interface PoolPointsInfo {
  pool: Address;
  token: Address;
  symbol: string;

  amount: bigint;
  duration: string | undefined;
  name: string;
  type: PointsType;
  estimation: "absolute" | "relative";
  condition: "deposit" | "cross-chain-deposit" | "holding";
}

// pools
const POOLS = {
  WETH_V3_TRADE_ETH: "0xda0002859b2d05f66a753d8241fcde8623f26f4f",
  WBTC_V3_TRADE_ETH: "0xda00010eda646913f273e10e7a5d1f659242757d",
  USDC_V3_TRADE_ETH: "0xda00000035fef4082F78dEF6A8903bee419FbF8E",
  USDC_V3_1_INVARIANT_ETH: "0xc155444481854c60e7a29f4150373f479988f32d",

  WC_V3_SONIC: "0xcf4d737c38ef2ac9c7bdb4dbbc954b1932ea4a40",
  USDC_E_V3_SONIC: "0x6F6bda069FB05baB5E83B22FbDb54CBdF33f78ee",

  WETH_V3_TRADE_ARB: "0x04419d3509f13054f60d253E0c79491d9E683399",
  USDC_V3_TRADE_ARB: "0x890A69EF363C9c7BdD5E36eb95Ceb569F63ACbF6",

  WETH_V3_TRADE_OP: "0x42dB77B3103c71059F4b997d6441cFB299FD0d94",
  USDC_V3_TRADE_OP: "0xa210BB193Ca352Fa81fBd0e81Cb800580b0762eE",
} as const;

// tokens
const TOKENS = {
  NATIVE_ADDRESS: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",

  USDC_ETH: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  USDT_ETH: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  RSETH_ETH: "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7",
  LBTC_ETH: "0x8236a87084f8B84306f72007F36F2618A5634494",

  WS_SONIC: "0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38",
  USDC_E_SONIC: "0x29219dd400f2Bf60E5a23d13Be72B486D4038894",

  USDT_ARB: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",

  USDT_OP: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
} as const;

export const POOL_POINTS: PartialRecord<NetworkType, Array<PoolPointsInfo>> = {
  Mainnet: [
    {
      pool: POOLS.WETH_V3_TRADE_ETH,
      token: TOKENS.RSETH_ETH,
      symbol: "rsETH",

      amount: 7500n * 10000n,
      duration: "hour",
      name: `${REWARDS_BASE_INFO.kelp(1n).name} ${REWARDS_BASE_INFO.kelp(1n).units}`,
      type: REWARDS_BASE_INFO.kelp(1n).type,
      estimation: "relative",
      condition: "holding",
    },
    {
      pool: POOLS.WBTC_V3_TRADE_ETH,
      token: TOKENS.LBTC_ETH,
      symbol: "LBTC",

      amount: 2000n * 10000n,
      duration: "day",
      name: `${REWARDS_BASE_INFO.lombard(1n).name} LUX`,
      type: REWARDS_BASE_INFO.lombard(1n).type,
      estimation: "absolute",
      condition: "holding",
    },
    {
      pool: POOLS.USDC_V3_1_INVARIANT_ETH,
      token: TOKENS.USDC_ETH,
      symbol: "USDC",

      amount: 30n * 10000n,
      duration: "day",
      name: `${REWARDS_BASE_INFO.falcon(1n).name} ${REWARDS_BASE_INFO.falcon(1n).units}`,
      type: REWARDS_BASE_INFO.falcon(1n).type,
      estimation: "absolute",
      condition: "deposit",
    },
    {
      pool: POOLS.WETH_V3_TRADE_ETH,
      token: TOKENS.NATIVE_ADDRESS,
      symbol: "ETH",

      amount: 1000n * 10000n,
      duration: undefined,
      name: `${REWARDS_BASE_INFO.omni(1n).name} ${REWARDS_BASE_INFO.omni(1n).units}`,
      type: REWARDS_BASE_INFO.omni(1n).type,
      estimation: "absolute",
      condition: "cross-chain-deposit",
    },
    {
      pool: POOLS.USDC_V3_TRADE_ETH,
      token: TOKENS.USDC_ETH,
      symbol: "USDC",

      amount: 1n * 10000n,
      duration: undefined,
      name: `${REWARDS_BASE_INFO.omni(1n).name} ${REWARDS_BASE_INFO.omni(1n).units}`,
      type: REWARDS_BASE_INFO.omni(1n).type,
      estimation: "absolute",
      condition: "cross-chain-deposit",
    },
  ],
  Arbitrum: [
    {
      pool: POOLS.WETH_V3_TRADE_ARB,
      token: TOKENS.NATIVE_ADDRESS,
      symbol: "ETH",

      amount: 1000n * 10000n,
      duration: undefined,
      name: `${REWARDS_BASE_INFO.omni(1n).name} ${REWARDS_BASE_INFO.omni(1n).units}`,
      type: REWARDS_BASE_INFO.omni(1n).type,
      estimation: "absolute",
      condition: "cross-chain-deposit",
    },
    {
      pool: POOLS.USDC_V3_TRADE_ARB,
      token: TOKENS.USDC_ETH,
      symbol: "USDC",

      amount: 1n * 10000n,
      duration: undefined,
      name: `${REWARDS_BASE_INFO.omni(1n).name} ${REWARDS_BASE_INFO.omni(1n).units}`,
      type: REWARDS_BASE_INFO.omni(1n).type,
      estimation: "absolute",
      condition: "cross-chain-deposit",
    },
  ],
  Optimism: [
    {
      pool: POOLS.WETH_V3_TRADE_OP,
      token: TOKENS.NATIVE_ADDRESS,
      symbol: "ETH",

      amount: 1000n * 10000n,
      duration: undefined,
      name: `${REWARDS_BASE_INFO.omni(1n).name} ${REWARDS_BASE_INFO.omni(1n).units}`,
      type: REWARDS_BASE_INFO.omni(1n).type,
      estimation: "absolute",
      condition: "cross-chain-deposit",
    },
    {
      pool: POOLS.USDC_V3_TRADE_OP,
      token: TOKENS.USDC_ETH,
      symbol: "USDC",

      amount: 1n * 10000n,
      duration: undefined,
      name: `${REWARDS_BASE_INFO.omni(1n).name} ${REWARDS_BASE_INFO.omni(1n).units}`,
      type: REWARDS_BASE_INFO.omni(1n).type,
      estimation: "absolute",
      condition: "cross-chain-deposit",
    },
  ],
};
