import moment from "moment";
import type { Address } from "viem";

import type { Apy, APYResult, GearAPY, TokenAPY } from "./apy";
import {
  getAPYConstant,
  getAPYCurve,
  getAPYEthena,
  getAPYLama,
  getAPYLido,
  getAPYSky,
  getAPYYearn,
  getGearAPY,
} from "./apy";
import type { PointsResult } from "./points";
import { getPoints } from "./points";
import type { PoolPointsResult } from "./poolRewards";
import { getPoolPoints } from "./poolRewards";
import type { TokenExtraRewardsResult } from "./tokenExtraRewards";
import { getTokenExtraRewards } from "./tokenExtraRewards";
import type { NetworkType } from "./utils";
import { getChainId, supportedChains } from "./utils";

export type ApyDetails = Apy & { lastUpdated: string };
type TokenDetails = TokenAPY<ApyDetails>;

interface NetworkState {
  tokenApyList: Record<Address, TokenDetails>;
  tokenExtraRewards: TokenExtraRewardsResult;
  tokenPointsList: PointsResult;

  poolPointsList: PoolPointsResult;

  gear: GearAPY;
}

function log(
  network: NetworkType,
  allProtocolAPYs: Array<PromiseSettledResult<APYResult>>,
  pointsList: PromiseSettledResult<PointsResult>,
  tokenExtraRewards: PromiseSettledResult<TokenExtraRewardsResult>,

  poolPointsList: PromiseSettledResult<PoolPointsResult>,

  gearAPY: PromiseSettledResult<GearAPY>,
) {
  const list = allProtocolAPYs.map(apyRes => {
    const entries =
      apyRes.status === "fulfilled" ? Object.entries(apyRes.value) : [];

    const tokens = entries.map(([_, v]) => v.symbol).join(", ");
    const protocol = entries[0]?.[1]?.apys?.[0]?.protocol || "unknown";

    if (tokens !== "") {
      console.log(`${protocol}: ${tokens}`);
    }
    if (apyRes.status === "rejected") {
      console.log(`${protocol}: ${apyRes.reason}`);
    }

    return `${protocol}: ${entries.length}`;
  });
  console.log(`Fetched ${list} for ${network}`);

  if (gearAPY.status === "fulfilled") {
    console.log(`Gear: ${JSON.stringify(gearAPY.value)}`);
  } else {
    console.log(`Gear error: ${gearAPY.reason}`);
  }

  if (pointsList.status === "fulfilled") {
    console.log(
      `Fetched points for ${Object.values(pointsList.value)
        .map(p => p.symbol)
        .join(", ")} for ${network}`,
    );
  } else {
    console.log(`Points error: ${pointsList.reason}`);
  }

  if (tokenExtraRewards.status === "fulfilled") {
    console.log(
      `Fetched points for ${Object.values(tokenExtraRewards.value)
        .map(p => p.map(t => `${t.token}: ${t.rewardSymbol}`))
        .flat(1)
        .join(", ")} for ${network}`,
    );
  } else {
    console.log(`Points error: ${tokenExtraRewards.reason}`);
  }

  if (poolPointsList.status === "fulfilled") {
    console.log(
      `Fetched pool points for ${Object.values(poolPointsList.value)
        .map(p => p.map(t => `${t.pool}: ${t.symbol}`))
        .flat(1)
        .join(", ")} for ${network}`,
    );
  } else {
    console.log(`Points error: ${poolPointsList.reason}`);
  }
}

export class Fetcher {
  public cache: Record<number, NetworkState>;

  constructor() {
    this.cache = {};
  }

  private async getNetworkState(network: NetworkType): Promise<NetworkState> {
    const [gearAPY, points, poolPoints, extraRewards, ...allProtocolAPYs] =
      await Promise.allSettled([
        getGearAPY(network),

        getPoints(network),

        getPoolPoints(network),

        getTokenExtraRewards(network),

        getAPYCurve(network),
        getAPYEthena(network),
        getAPYLama(network),
        getAPYLido(network),
        getAPYSky(network),
        getAPYYearn(network),
        getAPYConstant(network),
      ]);
    log(network, allProtocolAPYs, points, extraRewards, poolPoints, gearAPY);

    const time = moment().utc().format();

    const tokenApyList = allProtocolAPYs.reduce<Record<Address, TokenDetails>>(
      (acc, apyRes) => {
        if (apyRes.status === "fulfilled") {
          Object.entries(apyRes.value).forEach(([addr, tokenAPY]) => {
            const address = addr.toLowerCase() as Address;

            const apyList = tokenAPY?.apys.map(
              ({ reward, ...rest }): ApyDetails => ({
                ...rest,
                lastUpdated: time,
                reward: reward.toLowerCase() as Address,
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

    const tokenPointsList = points.status === "fulfilled" ? points.value : {};

    const poolPointsList =
      poolPoints.status === "fulfilled" ? poolPoints.value : {};

    const tokenExtraRewards =
      extraRewards.status === "fulfilled" ? extraRewards.value : {};

    return {
      gear:
        gearAPY.status === "fulfilled"
          ? gearAPY.value
          : { base: 0, crv: 0, gear: 0 },
      tokenApyList,
      tokenPointsList,
      poolPointsList,
      tokenExtraRewards,
    };
  }

  async run() {
    console.log("updating fetcher");
    for (const network of Object.values(supportedChains)) {
      const chainId = getChainId(network);
      const state = await this.getNetworkState(network as NetworkType);
      this.cache[chainId] = state;
    }
  }

  async loop() {
    void this.run();
    setInterval(this.run.bind(this), 60 * 60 * 1000); // 1 hr
  }
}
