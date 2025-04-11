import moment from "moment";
import type { Logger } from "pino";
import type { Address } from "viem";

import type { Apy, APYResult, GearAPY, TokenAPY } from "./apy";
import {
  getAPYCoinshift,
  getAPYConstant,
  getAPYCurve,
  getAPYEthena,
  getAPYLama,
  getAPYLido,
  getAPYSky,
  getAPYSonic,
  getAPYTreehouse,
  getAPYYearn,
  getGearAPY,
} from "./apy";
import type { PointsResult } from "./points";
import { getPoints } from "./points";
import type { PoolExternalAPYResult, PoolPointsResult } from "./poolRewards";
import { getPoolExternalAPY, getPoolPoints } from "./poolRewards";
import { captureException } from "./sentry";
import type { TokenExtraCollateralAPYResult } from "./tokenExtraCollateralAPY";
import { getTokenExtraCollateralAPY } from "./tokenExtraCollateralAPY";
import type { TokenExtraCollateralPointsResult } from "./tokenExtraCollateralPoints";
import { getTokenExtraCollateralPoints } from "./tokenExtraCollateralPoints";
import type { TokenExtraRewardsResult } from "./tokenExtraRewards";
import { getTokenExtraRewards } from "./tokenExtraRewards";
import type { NetworkType } from "./utils";
import { getChainId, supportedChains } from "./utils";

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

  gear: GearAPYDetails;
}

export class Fetcher {
  public logger: Logger;
  public cache: Record<number, NetworkState>;

  constructor(logger: Logger) {
    this.cache = {};
    this.logger = logger;
  }

  private async getNetworkState(network: NetworkType): Promise<NetworkState> {
    const [
      gearAPY,
      points,

      poolPoints,
      poolExternalAPY,

      extraRewards,
      extraCollateralAPY,
      extraCollateralPoints,

      ...allProtocolAPYs
    ] = await Promise.allSettled([
      getGearAPY(network),
      getPoints(network),

      getPoolPoints(network),
      getPoolExternalAPY(network),

      getTokenExtraRewards(network),
      getTokenExtraCollateralAPY(network),
      getTokenExtraCollateralPoints(network),

      getAPYCurve(network),
      getAPYEthena(network),
      getAPYLama(network),
      getAPYLido(network),
      getAPYSky(network),
      getAPYYearn(network),
      getAPYTreehouse(network),
      getAPYConstant(network),
      getAPYSonic(network),
      getAPYCoinshift(network),
    ]);
    log({
      logger: this.logger,

      network,
      allProtocolAPYs,
      pointsList: points,
      tokenExtraRewards: extraRewards,
      extraCollateralAPY,
      extraCollateralPoints,

      poolPointsList: poolPoints,
      poolExternalAPYList: poolExternalAPY,

      gearAPY,
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

    const gear =
      gearAPY.status === "fulfilled"
        ? { ...gearAPY.value, lastUpdated: time }
        : ({} as GearAPYDetails);

    return {
      gear,
      tokenApyList,

      tokenPointsList,
      poolPointsList,
      poolExternalAPYList,
      tokenExtraRewards,
      tokenExtraCollateralAPY,
      tokenExtraCollateralPoints,
    };
  }

  async run() {
    this.logger.info("[SYSTEM]: Updating fetcher");

    for (const network of Object.values(supportedChains)) {
      const chainId = getChainId(network);
      const { gear, tokenApyList, ...rest } = await this.getNetworkState(
        network as NetworkType,
      );

      const oldState = this.cache[chainId] || {};

      // partially update gear and apys
      this.cache[chainId] = {
        ...oldState,
        ...rest,
        gear: {
          ...(oldState.gear || {}),
          ...gear,
        },
        tokenApyList: {
          ...(oldState.tokenApyList || {}),
          ...tokenApyList,
        },
      };
    }
  }

  async loop() {
    void this.run();
    setInterval(this.run.bind(this), 60 * 60 * 1000); // 1 hr
  }
}

interface LogProps {
  network: NetworkType;
  allProtocolAPYs: Array<PromiseSettledResult<APYResult>>;
  pointsList: PromiseSettledResult<PointsResult>;
  tokenExtraRewards: PromiseSettledResult<TokenExtraRewardsResult>;
  extraCollateralAPY: PromiseSettledResult<TokenExtraCollateralAPYResult>;
  extraCollateralPoints: PromiseSettledResult<TokenExtraCollateralPointsResult>;

  poolPointsList: PromiseSettledResult<PoolPointsResult>;
  poolExternalAPYList: PromiseSettledResult<PoolExternalAPYResult>;

  gearAPY: PromiseSettledResult<GearAPY>;

  logger: Logger;
}

function log({
  logger,

  network,
  allProtocolAPYs,
  pointsList,
  tokenExtraRewards,
  extraCollateralAPY,
  extraCollateralPoints,

  poolPointsList,
  poolExternalAPYList,

  gearAPY,
}: LogProps) {
  logger.info(`\n`);
  logger.info(`[${network}] FETCHED RESULTS`);

  const APY = "PROTOCOL APY";

  const fetchedAPYProtocols = allProtocolAPYs
    .map(apy => {
      const entries =
        apy.status === "fulfilled" ? Object.entries(apy.value) : [];

      const tokens = entries.map(([_, v]) => v.symbol).join(", ");
      const protocolUnsafe = entries[0]?.[1]?.apys?.[0]?.protocol;
      const protocol = protocolUnsafe || "unknown";

      if (tokens !== "") {
        logger.info(`[${network}] (${APY}): ${protocol}: ${tokens}`);
      }
      if (apy.status === "rejected") {
        logger.error(`[${network}] (${APY}): ${protocol}: ${apy.reason}`);
        captureException({
          file: `/fetcher/${APY}/${network}/${protocol}`,
          error: apy.reason,
        });
      }

      return !protocolUnsafe && entries.length === 0
        ? undefined
        : `${protocol}: ${entries.length}`;
    })
    .filter(r => !!r);
  if (fetchedAPYProtocols.length > 0) {
    logger.info(
      `[${network}] (${APY}) TOTAL: ${fetchedAPYProtocols.join(", ")}`,
    );
  } else {
    logger.info(`[${network}] (${APY}): no apy fetched`);
  }

  const GEAR = "GEAR";

  if (gearAPY.status === "fulfilled") {
    logger.info(`[${network}] (${GEAR}): ${JSON.stringify(gearAPY.value)}`);
  } else {
    logger.error(`[${network}] (${GEAR}): ${gearAPY.reason}`);
    captureException({
      file: `/fetcher/${GEAR}/${network}`,
      error: gearAPY.reason,
    });
  }

  const POINTS = "POINTS";

  if (pointsList.status === "fulfilled") {
    const l = Object.values(pointsList.value);

    if (l.length > 0) {
      logger.info(
        `[${network}] (${POINTS}): ${l.map(p => p.symbol).join(", ")}`,
      );
    } else {
      logger.info(`[${network}] (${POINTS}): no points fetched`);
    }
  } else {
    logger.error(`[${network}] (${POINTS}): ${pointsList.reason}`);
    captureException({
      file: `/fetcher/${POINTS}/${network}`,
      error: pointsList.reason,
    });
  }

  const EXTRA_REWARDS = "EXTRA REWARDS";

  if (tokenExtraRewards.status === "fulfilled") {
    const l = Object.values(tokenExtraRewards.value);

    if (l.length > 0) {
      logger.info(
        `[${network}] (${EXTRA_REWARDS}): ${l
          .map(p => p.map(t => `${t.symbol}: ${t.rewardSymbol}`))
          .flat(1)
          .join(", ")}`,
      );
    } else {
      logger.info(`[${network}] (${EXTRA_REWARDS}): fetched no extra rewards`);
    }
  } else {
    logger.error(
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
      logger.info(
        `[${network}] (${POOL_POINTS}):  ${l
          .map(p => p.map(t => `${t.pool}: ${t.symbol}`))
          .flat(1)
          .join(", ")}`,
      );
    } else {
      logger.info(`[${network}] (${POOL_POINTS}): fetched no pool points`);
    }
  } else {
    logger.error(`[${network}] (${POOL_POINTS}): ${poolPointsList.reason}`);
    captureException({
      file: `/fetcher/${POOL_POINTS}/${network}`,
      error: poolPointsList.reason,
    });
  }

  const EXTERNAL_APY = "EXTERNAL APY";

  if (poolExternalAPYList.status === "fulfilled") {
    const l = Object.values(poolExternalAPYList.value);

    if (l.length > 0) {
      logger.info(
        `\[${network}] (${EXTERNAL_APY}): ${l
          .map(p => p.map(t => `${t.pool}: ${t.name} - ${t.value}`))
          .flat(1)
          .join(", ")}`,
      );
    } else {
      logger.info(
        `[${network}] (${EXTERNAL_APY}): fetched no pool external apy`,
      );
    }
  } else {
    logger.error(
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
      logger.info(
        `[${network}] (${EXTRA_COLLATERAL_APY}): ${l
          .map(p => p.map(t => `${t.pool}: ${t.symbol}`))
          .flat(1)
          .join(", ")}`,
      );
    } else {
      logger.info(
        `[${network}] (${EXTRA_COLLATERAL_APY}): fetched no extra collateral apy`,
      );
    }
  } else {
    logger.error(
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
      logger.info(
        `[${network}] (${EXTRA_POINTS}): ${extraPoints
          .map(p => p.symbol)
          .join(", ")} for ${network}`,
      );
    } else {
      logger.info(
        `[${network}] (${EXTRA_POINTS}): fetched no extra collateral points`,
      );
    }
  } else {
    logger.error(
      `[${network}] (${EXTRA_POINTS}): ${extraCollateralPoints.reason}`,
    );
    captureException({
      file: `/fetcher/${EXTRA_POINTS}/${network}`,
      error: extraCollateralPoints.reason,
    });
  }
}
