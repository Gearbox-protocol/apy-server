import axios from "axios";
import type { Address } from "viem";

import type { NetworkType } from "../../utils";
import type { APYHandler, APYResult } from "../constants";
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
  Base: "base",
  Sonic: "sonic",
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
  // !& sonic filter
  if (network === "Sonic" || network === "Base") return {};

  const { volumes, pools } = await getCurvePools(network);

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

  return result;
};

async function getCurvePools(network: NetworkType) {
  switch (network) {
    case "Mainnet": {
      const [volumes, ...pools] = await Promise.all([
        axios.get<VolumesResponse>(getVolumesURL(network)),

        axios.get<CurvePoolDataResponse>(getFactoryCryptoURL(network)),

        axios.get<CurvePoolDataResponse>(getMainURL(network)),
        axios.get<CurvePoolDataResponse>(getCryptoURL(network)),
        axios.get<CurvePoolDataResponse>(getFactoryTriCryptoURL(network)),
        axios.get<CurvePoolDataResponse>(getFactoryCrvUsdURL(network)),
        axios.get<CurvePoolDataResponse>(getFactoryStableNgURL(network)),
      ]);
      return {
        volumes,
        pools: pools,
      };
    }
    case "Arbitrum": {
      const [volumes, ...pools] = await Promise.all([
        axios.get<VolumesResponse>(getVolumesURL(network)),
        axios.get<CurvePoolDataResponse>(getMainURL(network)),
        axios.get<CurvePoolDataResponse>(getFactoryStableNgURL(network)),
      ]);

      return {
        volumes,
        pools,
      };
    }

    case "Optimism": {
      const [volumes, ...pools] = await Promise.all([
        axios.get<VolumesResponse>(getVolumesURL(network)),
        axios.get<CurvePoolDataResponse>(getMainURL(network)),
        axios.get<CurvePoolDataResponse>(getFactoryStableNgURL(network)),
      ]);

      return {
        volumes,
        pools,
      };
    }

    case "Base": {
      const [volumes, ...pools] = await Promise.all([
        axios.get<VolumesResponse>(getVolumesURL(network)),
        axios.get<CurvePoolDataResponse>(getMainURL(network)),
        axios.get<CurvePoolDataResponse>(getFactoryStableNgURL(network)),
      ]);

      return {
        volumes,
        pools,
      };
    }

    default:
      throw new Error(`Unknown network ${network}`);
  }
}

interface GearAPY {
  base: number;
  crv: number;
  gear: number;
}

async function getGearAPY(_: NetworkType): Promise<GearAPY> {
  const [mainnetVolumes, mainnetFactoryPools] = await Promise.all([
    axios.get<VolumesResponse>(getVolumesURL("Mainnet")),
    axios.get<CurvePoolDataResponse>(getFactoryCryptoURL("Mainnet")),
  ]);

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

  const gear = (gearPool?.gaugeRewards || [])
    .filter(({ symbol }) => symbol.toLowerCase() === "gear")
    .map(({ apy = 0 }) => apy);

  const gearAPY: GearAPY = {
    base: gearVolume?.latestDailyApyPcent || 0,
    crv: Math.max(...(gearPool?.gaugeCrvApy || []), 0),
    gear: Math.max(...gear, 0),
  };

  return gearAPY;
}

export { GearAPY, getAPY as getAPYCurve, getGearAPY };
