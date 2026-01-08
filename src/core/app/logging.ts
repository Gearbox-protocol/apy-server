import type { PoolExternalAPYResult, PoolPointsResult } from "../../pools";
import type { PoolExtraAPYResultByChain } from "../../pools/extraAPY/constants";
import type { APYHandler, APYResult, GearAPY } from "../../tokens/apy";
import type { PointsResult } from "../../tokens/points";
import type { TokenExtraCollateralAPYResult } from "../../tokens/tokenExtraCollateralAPY";
import type { TokenExtraCollateralPointsResult } from "../../tokens/tokenExtraCollateralPoints";
import type { TokenExtraRewardsResult } from "../../tokens/tokenExtraRewards";
import type { NetworkType } from "../chains";
import { getNetworkType } from "../chains";
import { captureException } from "../sentry";

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

export function logRewards({
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
          .flatMap(p => p.map(t => `${t.symbol}: ${t.rewardSymbol}`))
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
          .flatMap(p => p.map(t => `${t.pool}: ${t.symbol}`))
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
        `[${network}] (${EXTERNAL_APY}): ${l
          .flatMap(p => p.map(t => `${t.pool}: ${t.name} - ${t.value}`))
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
          .flatMap(p => p.map(t => `${t.pool}: ${t.symbol}`))
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

export function logGear({ gearAPY }: LogGearProps) {
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

export function logPoolExtraAPY({ poolExtraAPY }: LogPoolExtraAPYProps) {
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
