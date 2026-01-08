import {
  getChain,
  type NetworkType,
  SUPPORTED_NETWORKS,
} from "@gearbox-protocol/sdk";
import moment from "moment";
import type { Address } from "viem";
import type { PoolExternalAPYResult, PoolPointsResult } from "../../pools";
import { getPoolExternalAPY, getPoolPoints } from "../../pools";
import { getPoolExtraAPY } from "../../pools/extraAPY/apy";
import type { PoolExtraAPYResultByChain } from "../../pools/extraAPY/constants";
import type { Apy, GearAPY, TokenAPY } from "../../tokens/apy";
import {
  getAPYAvantprotocol,
  getAPYCoinshift,
  getAPYConstant,
  getAPYCurve,
  getAPYEtherfi,
  getAPYFalcon,
  getAPYLama,
  getAPYMagma,
  getAPYMakina,
  getAPYMellow,
  getAPYMellowVaults,
  getAPYMerkle,
  getAPYMidas,
  getAPYPendle,
  getAPYRenzo,
  getAPYResolv,
  getAPYSky,
  getAPYSonic,
  getAPYTreehouse,
  getAPYUpshift,
  getAPYYearn,
  getAPYYuzu,
  getGearAPY,
} from "../../tokens/apy";
import type { PointsResult } from "../../tokens/points";
import { getPoints } from "../../tokens/points";
import type { TokenExtraCollateralAPYResult } from "../../tokens/tokenExtraCollateralAPY";
import { getTokenExtraCollateralAPY } from "../../tokens/tokenExtraCollateralAPY";
import type { TokenExtraCollateralPointsResult } from "../../tokens/tokenExtraCollateralPoints";
import { getTokenExtraCollateralPoints } from "../../tokens/tokenExtraCollateralPoints";
import type { TokenExtraRewardsResult } from "../../tokens/tokenExtraRewards";
import { getTokenExtraRewards } from "../../tokens/tokenExtraRewards";
import { PACKAGE_VERSION, TIMEOUT } from "../config";
import type { Output } from "../output";
import { withTimeout } from "../utils";
import { logGear, logPoolExtraAPY, logRewards } from "./logging";
import type { PoolOutputDetails, TokenOutputDetails } from "./types";
import { removePool, removeSymbolAndAddress } from "./types";

export type ApyDetails = Apy & { lastUpdated: string };
type TokenDetails = TokenAPY<ApyDetails>;

export type GearAPYDetails = GearAPY & { lastUpdated: string };

interface NetworkState {
  tokenApyList: Record<Address, TokenDetails>;
  tokenExtraCollateralAPY: TokenExtraCollateralAPYResult;
  tokenExtraRewards: TokenExtraRewardsResult;
  tokenPointsList: PointsResult;
  tokenExtraCollateralPoints: TokenExtraCollateralPointsResult;

  poolPointsList: PoolPointsResult;
  poolExternalAPYList: PoolExternalAPYResult;
}

export type DataResult<T> =
  | { status: "ok"; data: T }
  | { status: "error"; message: string; code?: string };

export class Fetcher {
  public rewards: Record<number, NetworkState> = {};
  public gear: GearAPYDetails | undefined;
  public poolExtraAPY: PoolExtraAPYResultByChain = {};

  public async run(): Promise<Output> {
    if (TIMEOUT) {
      return withTimeout(() => this.#run(), TIMEOUT * 1000);
    } else {
      return this.#run();
    }
  }

  public getTokenRewards(chainId: number): DataResult<TokenOutputDetails[]> {
    try {
      const data = Object.entries(
        this.rewards[chainId]?.tokenApyList || {},
      ).reduce<Record<Address, TokenOutputDetails>>((acc, [t, a]) => {
        const cleared = removeSymbolAndAddress(a.apys);

        acc[t as Address] = {
          chainId: chainId,
          address: t,
          symbol: a.symbol,
          rewards: {
            apy: cleared,
            points: [],
            extraRewards: [],
            extraCollateralAPY: [],
            extraCollateralPoints: [],
          },
        };

        return acc;
      }, {});

      Object.entries(this.rewards[chainId]?.tokenPointsList || {}).forEach(
        ([t, p]) => {
          const token = t as Address;
          const cleared = removeSymbolAndAddress([p]);

          if (data[token]) {
            data[token].rewards.points.push(...cleared);
          } else {
            data[token] = {
              chainId: chainId,
              address: t,
              symbol: p.symbol,
              rewards: {
                apy: [],
                points: cleared,
                extraRewards: [],
                extraCollateralAPY: [],
                extraCollateralPoints: [],
              },
            };
          }
        },
      );

      Object.entries(this.rewards[chainId]?.tokenExtraRewards || {}).forEach(
        ([t, ex]) => {
          const token = t as Address;
          const cleared = removeSymbolAndAddress(ex);

          if (ex.length > 0) {
            if (data[token]) {
              data[token].rewards.extraRewards.push(...cleared);
            } else {
              data[token] = {
                chainId: chainId,
                address: t,
                symbol: ex[0].symbol,
                rewards: {
                  apy: [],
                  points: [],
                  extraRewards: cleared,
                  extraCollateralAPY: [],
                  extraCollateralPoints: [],
                },
              };
            }
          }
        },
      );

      Object.entries(
        this.rewards[chainId]?.tokenExtraCollateralAPY || {},
      ).forEach(([t, ex]) => {
        const token = t as Address;
        const cleared = removeSymbolAndAddress(ex);

        if (ex.length > 0) {
          if (data[token]) {
            data[token].rewards.extraCollateralAPY.push(...cleared);
          } else {
            data[token] = {
              chainId: chainId,
              address: t,
              symbol: ex[0].symbol,
              rewards: {
                apy: [],
                points: [],
                extraRewards: [],
                extraCollateralAPY: cleared,
                extraCollateralPoints: [],
              },
            };
          }
        }
      });

      Object.entries(
        this.rewards[chainId]?.tokenExtraCollateralPoints || {},
      ).forEach(([t, p]) => {
        const token = t as Address;
        const cleared = removeSymbolAndAddress([p]);

        if (data[token]) {
          data[token].rewards.extraCollateralPoints.push(...cleared);
        } else {
          data[token] = {
            chainId: chainId,
            address: t,
            symbol: p.symbol,
            rewards: {
              apy: [],
              points: [],
              extraRewards: [],
              extraCollateralAPY: [],
              extraCollateralPoints: cleared,
            },
          };
        }
      });

      return { status: "ok", data: Object.values(data) };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
        code: "UNKNOWN_ERROR",
      };
    }
  }

  public getPoolRewards(chainId: number): DataResult<PoolOutputDetails[]> {
    try {
      const data = Object.entries(
        this.rewards[chainId]?.poolPointsList || {},
      ).reduce<Record<Address, PoolOutputDetails>>((acc, [p, rd]) => {
        const pool = p as Address;
        const cleared = removePool(rd);

        acc[pool] = {
          chainId: chainId,
          pool: pool,
          rewards: { points: cleared, externalAPY: [], extraAPY: [] },
        };

        return acc;
      }, {});

      Object.entries(this.rewards[chainId]?.poolExternalAPYList || {}).forEach(
        ([p, ex]) => {
          const pool = p as Address;
          const cleared = removePool(ex);

          if (ex.length > 0) {
            if (data[pool]) {
              data[pool].rewards.externalAPY.push(...cleared);
            } else {
              data[pool] = {
                chainId: chainId,
                pool: pool,
                rewards: { points: [], externalAPY: cleared, extraAPY: [] },
              };
            }
          }
        },
      );

      Object.entries(this.poolExtraAPY[chainId] || {}).forEach(([p, ex]) => {
        const pool = p as Address;
        const cleared = ex;

        if (ex.length > 0) {
          if (data[pool]) {
            data[pool].rewards.extraAPY.push(...cleared);
          } else {
            data[pool] = {
              chainId: chainId,
              pool: pool,
              rewards: { points: [], externalAPY: [], extraAPY: cleared },
            };
          }
        }
      });

      return { status: "ok", data: Object.values(data) };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
        code: "UNKNOWN_ERROR",
      };
    }
  }

  public getGearAPY(): DataResult<GearAPYDetails> {
    try {
      const result: GearAPYDetails = {
        base: this.gear?.base || 0,
        crv: this.gear?.crv || 0,
        gear: this.gear?.gear || 0,
        gearPrice: this.gear?.gearPrice || 0,
        lastUpdated: this.gear?.lastUpdated || "0",
      };

      return { status: "ok", data: result };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
        code: "UNKNOWN_ERROR",
      };
    }
  }

  private async getNetworkRewards(
    network: NetworkType,
  ): Promise<Fetcher["rewards"][number]> {
    const protocolsAPYFunctions = [
      getAPYCurve,
      getAPYLama,
      getAPYSky,
      getAPYYearn,
      getAPYTreehouse,
      getAPYConstant,
      getAPYSonic,
      getAPYCoinshift,
      getAPYRenzo,
      getAPYEtherfi,
      getAPYMidas,
      getAPYMellow,
      getAPYMellowVaults,
      getAPYFalcon,
      getAPYResolv,
      getAPYMerkle,
      getAPYPendle,
      getAPYAvantprotocol,
      getAPYYuzu,
      getAPYUpshift,
      getAPYMagma,
      getAPYMakina,
    ];
    const [
      points,

      poolPoints,
      poolExternalAPY,

      extraRewards,
      extraCollateralAPY,
      extraCollateralPoints,

      ...allProtocolAPYs
    ] = await Promise.allSettled([
      getPoints(network),

      getPoolPoints(network),
      getPoolExternalAPY(network),

      getTokenExtraRewards(network),
      getTokenExtraCollateralAPY(network),
      getTokenExtraCollateralPoints(network),

      ...protocolsAPYFunctions.map(fn => fn(network)),
    ]);
    logRewards({
      network,
      allProtocolAPYs,
      protocolsAPYFunctions,
      pointsList: points,
      tokenExtraRewards: extraRewards,
      extraCollateralAPY,
      extraCollateralPoints,

      poolPointsList: poolPoints,
      poolExternalAPYList: poolExternalAPY,
    });

    const time = moment().utc().format();

    const tokenApyList = allProtocolAPYs.reduce<Record<Address, TokenDetails>>(
      (acc, apyRes) => {
        if (apyRes.status === "fulfilled") {
          Object.entries(apyRes.value).forEach(([addr, tokenAPY]) => {
            const address = addr.toLowerCase() as Address;

            const apyList = tokenAPY?.apys.map(
              ({ address, ...rest }): ApyDetails => ({
                ...rest,
                lastUpdated: time,
                address: address.toLowerCase() as Address,
              }),
            );

            acc[address] = {
              ...tokenAPY,
              address,
              apys: [...(acc[address]?.apys || []), ...apyList],
            };
          });
        }

        return acc;
      },
      {},
    );

    // empty object to skip updating previous state
    const tokenPointsList = points.status === "fulfilled" ? points.value : {};

    const poolPointsList =
      poolPoints.status === "fulfilled" ? poolPoints.value : {};

    const poolExternalAPYList =
      poolExternalAPY.status === "fulfilled" ? poolExternalAPY.value : {};

    const tokenExtraRewards =
      extraRewards.status === "fulfilled" ? extraRewards.value : {};

    const tokenExtraCollateralAPY =
      extraCollateralAPY.status === "fulfilled" ? extraCollateralAPY.value : {};

    const tokenExtraCollateralPoints =
      extraCollateralPoints.status === "fulfilled"
        ? extraCollateralPoints.value
        : {};

    return {
      tokenApyList,

      tokenPointsList,
      poolPointsList,
      poolExternalAPYList,
      tokenExtraRewards,
      tokenExtraCollateralAPY,
      tokenExtraCollateralPoints,
    };
  }

  private async getGearRewards(): Promise<NonNullable<Fetcher["gear"]>> {
    const [gearAPYResponse] = await Promise.allSettled([getGearAPY()]);
    logGear({ gearAPY: gearAPYResponse });

    const time = moment().utc().format();

    const gear =
      gearAPYResponse.status === "fulfilled"
        ? { ...gearAPYResponse.value, lastUpdated: time }
        : ({} as GearAPYDetails);

    return gear;
  }

  private async getPoolExtraAPY(): Promise<Fetcher["poolExtraAPY"]> {
    const [extraAPYResponse] = await Promise.allSettled([getPoolExtraAPY()]);
    logPoolExtraAPY({ poolExtraAPY: extraAPYResponse });

    const extraAPY =
      extraAPYResponse.status === "fulfilled" ? extraAPYResponse.value : {};

    return extraAPY;
  }

  private async runNetworkRewards() {
    console.log("[SYSTEM]: Updating rewards list");
    // TODO: Consider parallelizing chain processing with Promise.allSettled
    // Currently sequential, but chains are independent and could be processed in parallel
    for (const network of SUPPORTED_NETWORKS) {
      const chainId = getChain(network).id;
      const { tokenApyList, ...rest } = await this.getNetworkRewards(
        network as NetworkType,
      );

      const oldState = this.rewards[chainId] || {};

      // const entries = Object.entries(stateUpdate) as Array<
      //   [keyof NetworkState, NetworkState[keyof NetworkState]]
      // >;
      // const newState = entries.reduce<NetworkState>(
      //   (acc, [parameter, value]) => {
      //     const oldValue = oldState[parameter];

      //     return {
      //       ...acc,
      //       [parameter]: {
      //         ...oldValue,
      //         ...value,
      //       },
      //     };
      //   },
      //   oldState,
      // );

      // partially update apys
      this.rewards[chainId] = {
        ...oldState,
        ...rest,
        tokenApyList: {
          ...(oldState.tokenApyList || {}),
          ...tokenApyList,
        },
      };
    }
  }

  private async runGear() {
    console.log("[SYSTEM]: Updating gear");
    // partially update gear state
    const gear = await this.getGearRewards();
    this.gear = {
      ...(this.gear || {}),
      ...gear,
    };
  }

  private async runPoolExtraRewards() {
    console.log("[SYSTEM]: Updating pool extra rewards");
    // partially update gear state
    const extra = await this.getPoolExtraAPY();

    Object.entries(extra).forEach(([ch, chainAPY]) => {
      const chainId = Number(ch);

      const oldState = this.poolExtraAPY[chainId] || {};

      this.poolExtraAPY[chainId] = {
        ...oldState,
        ...chainAPY,
      };
    });
  }

  async #run(): Promise<Output> {
    console.log(`[SYSTEM]: Starting app v${PACKAGE_VERSION}`);

    await this.runNetworkRewards();
    await this.runGear();
    await this.runPoolExtraRewards();

    console.log(
      `[SYSTEM]: Data fetching completed. Processing ${Object.keys(this.rewards).length} chains...`,
    );

    // Collect results with error handling
    const output: Output = {
      gearApy: this.getGearAPY(),
      chains: {},
      timestamp: moment().utc().format(),
      metadata: {
        totalChains: 0,
        successfulChains: 0,
        failedChains: 0,
      },
    };

    // Process each chain independently
    // TODO: Consider parallelizing chain processing with Promise.allSettled
    // Currently sequential to match loop() behavior, but chains are independent
    for (const chainId of Object.keys(this.rewards).map(Number)) {
      const chainIdStr = String(chainId);
      try {
        output.chains[chainIdStr] = {
          tokens: this.getTokenRewards(chainId),
          pools: this.getPoolRewards(chainId),
        };

        output.metadata.totalChains++;

        const chainSuccess =
          output.chains[chainIdStr].tokens.status === "ok" &&
          output.chains[chainIdStr].pools.status === "ok";

        if (chainSuccess) {
          output.metadata.successfulChains++;
        } else {
          output.metadata.failedChains++;
          console.warn(`[SYSTEM]: Chain ${chainIdStr} processing had errors`);
        }
      } catch (error) {
        console.error(`[SYSTEM]: Error processing chain ${chainIdStr}:`, error);
        output.metadata.failedChains++;
      }
    }
    console.log(
      `[SYSTEM]: One-shot mode completed. Chains: ${output.metadata.totalChains}, Successful: ${output.metadata.successfulChains}, Failed: ${output.metadata.failedChains}`,
    );
    return output;
  }
}
