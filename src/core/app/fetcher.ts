import moment from "moment";
import type { Address } from "viem";

import type { PoolExternalAPYResult, PoolPointsResult } from "../../pools";
import { getPoolExternalAPY, getPoolPoints } from "../../pools";
import { getPoolExtraAPY } from "../../pools/extraAPY/apy";
import type { PoolExtraAPYResultByChain } from "../../pools/extraAPY/constants";
import type {
  Apy,
  APYHandler,
  APYResult,
  GearAPY,
  TokenAPY,
} from "../../tokens/apy";
import {
  getAPYCoinshift,
  getAPYConstant,
  getAPYCurve,
  getAPYEthena,
  getAPYEtherfi,
  getAPYFalcon,
  getAPYLama,
  getAPYMellow,
  getAPYMellowVaults,
  getAPYMidas,
  getAPYRenzo,
  getAPYResolv,
  getAPYSky,
  getAPYSonic,
  getAPYTreehouse,
  getAPYYearn,
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
import type { NetworkType } from "../chains";
import { getChainId, getNetworkType, supportedChains } from "../chains";
import { captureException } from "../sentry";

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

export class Fetcher {
  public rewards: Record<number, NetworkState>;
  public gear: GearAPYDetails | undefined;
  public poolExtraAPY: PoolExtraAPYResultByChain;

  constructor() {
    this.rewards = {};
    this.gear = undefined;
    this.poolExtraAPY = {};
  }

  private async getNetworkRewards(
    network: NetworkType,
  ): Promise<Fetcher["rewards"][number]> {
    const protocolsAPYFunctions = [
      getAPYCurve,
      getAPYEthena,
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
    for (const network of Object.values(supportedChains)) {
      const chainId = getChainId(network);
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

  async loop() {
    const hourTask = async () => {
      await this.runNetworkRewards();
      await this.runGear();
    };

    const quarterTask = async () => {
      await this.runPoolExtraRewards();
    };

    void (async () => {
      await hourTask();
      await quarterTask();
    })();

    setInterval(hourTask, 60 * 60 * 1000); // 60min
    setInterval(quarterTask, 15 * 60 * 1000); // 15 min
  }
}

interface LogRewardsProps {
  network: NetworkType;
  allProtocolAPYs: Array<PromiseSettledResult<APYResult>>;
  protocolsAPYFunctions: Array<APYHandler>;
  pointsList: PromiseSettledResult<PointsResult>;
  tokenExtraRewards: PromiseSettledResult<TokenExtraRewardsResult>;
  extraCollateralAPY: PromiseSettledResult<TokenExtraCollateralAPYResult>;
  extraCollateralPoints: PromiseSettledResult<TokenExtraCollateralPointsResult>;

  poolPointsList: PromiseSettledResult<PoolPointsResult>;
  poolExternalAPYList: PromiseSettledResult<PoolExternalAPYResult>;
}

function logRewards({
  network,
  allProtocolAPYs,
  protocolsAPYFunctions,
  pointsList,
  tokenExtraRewards,
  extraCollateralAPY,
  extraCollateralPoints,

  poolPointsList,
  poolExternalAPYList,
}: LogRewardsProps) {
  console.log(`\n`);
  console.log(`[${network}] FETCHED REWARDS RESULTS`);

  const APY = "PROTOCOL APY";

  const fetchedAPYProtocols = allProtocolAPYs
    .map((apy, index, arr) => {
      const entries =
        apy.status === "fulfilled" ? Object.entries(apy.value) : [];

      const tokens = entries.map(([_, v]) => v.symbol).join(", ");
      const protocolUnsafe = entries[0]?.[1]?.apys?.[0]?.protocol;
      const protocol =
        protocolUnsafe || protocolsAPYFunctions[index]?.name || "unknown";

      if (tokens !== "") {
        console.log(`[${network}] (${APY}): ${protocol}: ${tokens}`);
      }
      if (apy.status === "rejected") {
        console.error(`[${network}] (${APY}): ${protocol}: ${apy.reason}`);
        captureException({
          file: `/fetcher/${APY}/${network}/${protocol}(${index}/${arr})`,
          error: apy.reason,
        });
      }

      return !protocolUnsafe && entries.length === 0
        ? undefined
        : `${protocol}: ${entries.length}`;
    })
    .filter(r => !!r);
  if (fetchedAPYProtocols.length > 0) {
    console.log(
      `[${network}] (${APY}) TOTAL: ${fetchedAPYProtocols.join(", ")}`,
    );
  } else {
    console.log(`[${network}] (${APY}): no apy fetched`);
  }

  const POINTS = "POINTS";

  if (pointsList.status === "fulfilled") {
    const l = Object.values(pointsList.value);

    if (l.length > 0) {
      console.log(
        `[${network}] (${POINTS}): ${l.map(p => p.symbol).join(", ")}`,
      );
    } else {
      console.log(`[${network}] (${POINTS}): no points fetched`);
    }
  } else {
    console.error(`[${network}] (${POINTS}): ${pointsList.reason}`);
    captureException({
      file: `/fetcher/${POINTS}/${network}`,
      error: pointsList.reason,
    });
  }

  const EXTRA_REWARDS = "EXTRA REWARDS";

  if (tokenExtraRewards.status === "fulfilled") {
    const l = Object.values(tokenExtraRewards.value);

    if (l.length > 0) {
      console.log(
        `[${network}] (${EXTRA_REWARDS}): ${l
          .map(p => p.map(t => `${t.symbol}: ${t.rewardSymbol}`))
          .flat(1)
          .join(", ")}`,
      );
    } else {
      console.log(`[${network}] (${EXTRA_REWARDS}): fetched no extra rewards`);
    }
  } else {
    console.error(
      `[${network}] (${EXTRA_REWARDS}): ${tokenExtraRewards.reason}`,
    );
    captureException({
      file: `/fetcher/${EXTRA_REWARDS}/${network}`,
      error: tokenExtraRewards.reason,
    });
  }

  const POOL_POINTS = "POOL POINTS";

  if (poolPointsList.status === "fulfilled") {
    const l = Object.values(poolPointsList.value);

    if (l.length > 0) {
      console.log(
        `[${network}] (${POOL_POINTS}):  ${l
          .map(p => p.map(t => `${t.pool}: ${t.symbol}`))
          .flat(1)
          .join(", ")}`,
      );
    } else {
      console.log(`[${network}] (${POOL_POINTS}): fetched no pool points`);
    }
  } else {
    console.error(`[${network}] (${POOL_POINTS}): ${poolPointsList.reason}`);
    captureException({
      file: `/fetcher/${POOL_POINTS}/${network}`,
      error: poolPointsList.reason,
    });
  }

  const EXTERNAL_APY = "EXTERNAL APY";

  if (poolExternalAPYList.status === "fulfilled") {
    const l = Object.values(poolExternalAPYList.value);

    if (l.length > 0) {
      console.log(
        `\[${network}] (${EXTERNAL_APY}): ${l
          .map(p => p.map(t => `${t.pool}: ${t.name} - ${t.value}`))
          .flat(1)
          .join(", ")}`,
      );
    } else {
      console.log(
        `[${network}] (${EXTERNAL_APY}): fetched no pool external apy`,
      );
    }
  } else {
    console.error(
      `[${network}] (${EXTERNAL_APY}): ${poolExternalAPYList.reason}`,
    );
    captureException({
      file: `/fetcher/${EXTERNAL_APY}/${network}`,
      error: poolExternalAPYList.reason,
    });
  }

  const EXTRA_COLLATERAL_APY = "EXTRA COLLATERAL APY";

  if (extraCollateralAPY.status === "fulfilled") {
    const l = Object.values(extraCollateralAPY.value);

    if (l.length > 0) {
      console.log(
        `[${network}] (${EXTRA_COLLATERAL_APY}): ${l
          .map(p => p.map(t => `${t.pool}: ${t.symbol}`))
          .flat(1)
          .join(", ")}`,
      );
    } else {
      console.log(
        `[${network}] (${EXTRA_COLLATERAL_APY}): fetched no extra collateral apy`,
      );
    }
  } else {
    console.error(
      `[${network}] (${EXTRA_COLLATERAL_APY}): ${extraCollateralAPY.reason}`,
    );
    captureException({
      file: `/fetcher/${EXTRA_COLLATERAL_APY}/${network}`,
      error: extraCollateralAPY.reason,
    });
  }

  const EXTRA_POINTS = "EXTRA POINTS";

  if (extraCollateralPoints.status === "fulfilled") {
    const extraPoints = Object.values(extraCollateralPoints.value);

    if (extraPoints.length > 0) {
      console.log(
        `[${network}] (${EXTRA_POINTS}): ${extraPoints
          .map(p => p.symbol)
          .join(", ")} for ${network}`,
      );
    } else {
      console.log(
        `[${network}] (${EXTRA_POINTS}): fetched no extra collateral points`,
      );
    }
  } else {
    console.error(
      `[${network}] (${EXTRA_POINTS}): ${extraCollateralPoints.reason}`,
    );
    captureException({
      file: `/fetcher/${EXTRA_POINTS}/${network}`,
      error: extraCollateralPoints.reason,
    });
  }
}

interface LogGearProps {
  gearAPY: PromiseSettledResult<GearAPY>;
}

function logGear({ gearAPY }: LogGearProps) {
  const network = "All Networks";

  console.log(`\n`);
  console.log(`[${network}] FETCHED GEAR RESULTS`);

  const GEAR = "GEAR";

  if (gearAPY.status === "fulfilled") {
    console.log(`[${network}] (${GEAR}): ${JSON.stringify(gearAPY.value)}`);
  } else {
    console.error(`[${network}] (${GEAR}): ${gearAPY.reason}`);
    captureException({
      file: `/fetcher/${GEAR}/${network}`,
      error: gearAPY.reason,
    });
  }
}

interface LogPoolExtraAPYProps {
  poolExtraAPY: PromiseSettledResult<PoolExtraAPYResultByChain>;
}

function logPoolExtraAPY({ poolExtraAPY }: LogPoolExtraAPYProps) {
  const defaultNetwork = "All Networks";

  const EXTRA_APY = "POOL EXTRA APY";

  if (poolExtraAPY.status === "fulfilled") {
    Object.entries(poolExtraAPY.value).forEach(([chainId, chainAPY]) => {
      const network = getNetworkType(chainId) || chainId;

      console.log(`\n`);
      console.log(`[${network}] FETCHED POOL EXTRA APY RESULTS`);

      Object.values(chainAPY).forEach(poolAPY => {
        const poolString = [
          poolAPY[0]?.token,
          poolAPY
            .map(apy =>
              [apy.rewardTokenSymbol, apy.apy, `ts=${apy.endTimestamp}`].join(
                "/",
              ),
            )
            .join(", "),
        ].join(": ");

        console.log(`[${network}] (${EXTRA_APY}): ${poolString}`);

        return undefined;
      });
    });
  } else {
    console.error(`[${defaultNetwork}] (${EXTRA_APY}): ${poolExtraAPY.reason}`);
    captureException({
      file: `/fetcher/${EXTRA_APY}/${defaultNetwork}`,
      error: poolExtraAPY.reason,
    });
  }
}
