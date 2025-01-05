import axios from "axios";
import type { Address } from "viem";

import type { APYHandler, APYResult, NetworkType } from "../../utils";
import { GEAR_POOL, PROTOCOL, TOKENS } from "./constants";

interface VolumesResponse {
  data: {
    pools: [
      {
        address: Address;
        includedApyPcentFromLsts: number;
        latestDailyApyPcent: number;
        latestWeeklyApyPcent: number;
        type: string;
        virtualPrice: number;
        volumeUSD: number;
      },
    ];
  };
}

interface CurvePoolData {
  address: Address;
  amplificationCoefficient: string;
  assetType?: string;
  assetTypeName: string;
  coins: Array<{
    address: Address;
    decimals: string;
    isBasePoolLpToken: boolean;
    poolBalance: string;
    symbol: string;
    usdPrice: number;
  }>;
  coinsAddresses: Array<Address>;
  decimals: Array<string>;
  gaugeAddress: Address;
  gaugeCrvApy: Array<number>;
  gaugeRewards: Array<{
    apy: number;
    decimals: string;
    gaugeAddress: Address;
    name: string;
    symbol: string;
    tokenAddress: Address;
    tokenPrice: number;
  }>;
  id: string;
  implementation: string;
  implementationAddress: Address;
  isMetaPool: boolean;
  lpTokenAddress: Address;
  name: string;
  poolUrls: {
    deposit: Array<string>;
    swap: Array<string>;
    withdraw: Array<string>;
  };
  priceOracle: number;
  symbol: string;
  totalSupply: string;
  usdTotal: number;
  usdTotalExcludingBasePool: number;
  virtualPrice: string;
}
interface CurvePoolDataResponse {
  data: {
    poolData: Array<CurvePoolData>;
    tvlAll: number;
    tvl: number;
  };
}

type PoolRecord = Record<string, CurvePoolData>;
type VolumeRecord = Record<string, VolumesResponse["data"]["pools"][number]>;

const CURVE_CHAINS: Record<NetworkType, string> = {
  Arbitrum: "arbitrum",
  Mainnet: "ethereum",
  Optimism: "optimism",
};

// const CRYPTO = "https://api.curve.fi/api/getPools/${CURVE_CHAINS[n]}/crypto";
// const FACTORY = "https://api.curve.fi/api/getPools/${CURVE_CHAINS[n]}/factory";
// const CURVE_APY_URL = "https://www.convexfinance.com/api/curve-apys";
const getVolumesURL = (n: NetworkType) =>
  `https://api.curve.fi/api/getVolumes/${CURVE_CHAINS[n]}`;
const getMainURL = (n: NetworkType) =>
  `https://api.curve.fi/api/getPools/${CURVE_CHAINS[n]}/main`;
const getFactoryCryptoURL = (n: NetworkType) =>
  `https://api.curve.fi/api/getPools/${CURVE_CHAINS[n]}/factory-crypto`;
const getCryptoURL = (n: NetworkType) =>
  `https://api.curve.fi/api/getPools/${CURVE_CHAINS[n]}/crypto`;
const getFactoryTriCryptoURL = (n: NetworkType) =>
  `https://api.curve.fi/api/getPools/${CURVE_CHAINS[n]}/factory-tricrypto`;
const getFactoryCrvUsdURL = (n: NetworkType) =>
  `https://api.curve.fi/api/getPools/${CURVE_CHAINS[n]}/factory-crvusd`;
const getFactoryStableNgURL = (n: NetworkType) =>
  `https://api.curve.fi/api/getPools/${CURVE_CHAINS[n]}/factory-stable-ng`;

const getAPY: APYHandler = async network => {
  const { mainnetVolumes, mainnetFactoryPools, volumes, pools } =
    await getCurvePools(network);

  const tokens = Object.fromEntries(
    Object.entries(TOKENS[network]).map(([k, v]) => [k.toLowerCase(), v]),
  ) as Record<Address, string>;

  const volumeByAddress = volumes.data.data.pools.reduce<VolumeRecord>(
    (acc, v) => {
      acc[v.address.toLowerCase()] = v;
      return acc;
    },
    {},
  );

  const poolDataByAddress = pools.reduce<PoolRecord>((acc, poolCategory) => {
    const { poolData = [] } = poolCategory?.data?.data || {};

    poolData.forEach(p => {
      acc[p.lpTokenAddress.toLowerCase()] = p;
    });

    return acc;
  }, {});

  const result = Object.entries(tokens).reduce<APYResult>(
    (acc, [addr, symbol]) => {
      const address = addr as Address;

      const pool = poolDataByAddress[address];
      if (!pool) return acc;

      const volume = volumeByAddress[pool.address.toLowerCase()];
      const baseAPY = volume?.latestDailyApyPcent || 0;

      acc[pool.lpTokenAddress] = {
        address: pool.lpTokenAddress,
        symbol,

        apys: [
          {
            reward: pool.lpTokenAddress,
            symbol,
            protocol: PROTOCOL,
            value: baseAPY,
          },
        ],
      };

      return acc;
    },
    {} as APYResult,
  );

  const poolFactoryByAddress = (
    mainnetFactoryPools?.data?.data?.poolData || []
  ).reduce<PoolRecord>((acc, p) => {
    acc[p.lpTokenAddress.toLowerCase()] = p;
    return acc;
  }, {});

  const mainnetVolumeByAddress =
    mainnetVolumes.data.data.pools.reduce<VolumeRecord>((acc, v) => {
      acc[v.address.toLowerCase()] = v;
      return acc;
    }, {});

  const gearPool = poolFactoryByAddress[GEAR_POOL];
  const gearVolume =
    mainnetVolumeByAddress[(gearPool?.address || "").toLowerCase()];

  result[GEAR_POOL] = {
    address: gearPool.lpTokenAddress,
    symbol: gearPool.symbol,

    apys: [
      {
        reward: gearPool.lpTokenAddress,
        symbol: gearPool.symbol,
        protocol: PROTOCOL,
        value: gearVolume?.latestDailyApyPcent || 0,
      },
    ],
  };

  return result;
};

async function getCurvePools(network: NetworkType) {
  switch (network) {
    case "Mainnet": {
      const [volumes, mainnetFactoryPools, ...pools] = await Promise.all([
        axios.get<VolumesResponse>(getVolumesURL(network)),
        axios.get<CurvePoolDataResponse>(getFactoryCryptoURL(network)),

        axios.get<CurvePoolDataResponse>(getMainURL(network)),
        axios.get<CurvePoolDataResponse>(getCryptoURL(network)),
        axios.get<CurvePoolDataResponse>(getFactoryTriCryptoURL(network)),
        axios.get<CurvePoolDataResponse>(getFactoryCrvUsdURL(network)),
        axios.get<CurvePoolDataResponse>(getFactoryStableNgURL(network)),
      ]);
      return {
        mainnetVolumes: volumes,
        mainnetFactoryPools,

        volumes,
        pools: [mainnetFactoryPools, ...pools],
      };
    }
    case "Arbitrum": {
      const [mainnetVolumes, mainnetFactoryPools, volumes, ...pools] =
        await Promise.all([
          axios.get<VolumesResponse>(getVolumesURL("Mainnet")),
          axios.get<CurvePoolDataResponse>(getFactoryCryptoURL("Mainnet")),

          axios.get<VolumesResponse>(getVolumesURL(network)),
          axios.get<CurvePoolDataResponse>(getMainURL(network)),
          axios.get<CurvePoolDataResponse>(getFactoryStableNgURL(network)),
        ]);

      return {
        mainnetVolumes,
        mainnetFactoryPools,

        volumes,
        pools,
      };
    }

    case "Optimism": {
      const [mainnetVolumes, mainnetFactoryPools, volumes, ...pools] =
        await Promise.all([
          axios.get<VolumesResponse>(getVolumesURL("Mainnet")),
          axios.get<CurvePoolDataResponse>(getFactoryCryptoURL("Mainnet")),

          axios.get<VolumesResponse>(getVolumesURL(network)),
          axios.get<CurvePoolDataResponse>(getMainURL(network)),
          axios.get<CurvePoolDataResponse>(getFactoryStableNgURL(network)),
        ]);

      return {
        mainnetVolumes,
        mainnetFactoryPools,

        volumes,
        pools,
      };
    }
    default:
      throw new Error(`Unknown network ${network}`);
  }
}

export { getAPY as getAPYCurve };
