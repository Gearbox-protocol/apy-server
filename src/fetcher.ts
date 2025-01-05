import moment from "moment";
import type { Address } from "viem";

import type { GearAPY } from "./apy";
import {
  getAPYCurve,
  getAPYEthena,
  getAPYLama,
  getAPYLido,
  getAPYSky,
  getAPYYearn,
  getGearAPY,
} from "./apy";
import type { Apy, APYResult, NetworkType, TokenAPY } from "./utils";
import { getChainId, supportedChains } from "./utils";

export type ApyDetails = Apy & { lastUpdated: string };
type TokenDetails = TokenAPY<ApyDetails>;

interface NetworkState {
  tokens: Record<Address, TokenDetails>;
  gear: GearAPY;
}

function log(
  network: NetworkType,
  allProtocolAPYs: Array<PromiseSettledResult<APYResult>>,
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
}

export class Fetcher {
  public cache: Record<number, NetworkState>;

  constructor() {
    this.cache = {};
  }

  private async getNetworkState(network: NetworkType): Promise<NetworkState> {
    const [gearAPY, ...allProtocolAPYs] = await Promise.allSettled([
      getGearAPY(network),
      getAPYCurve(network),
      getAPYEthena(network),
      getAPYLama(network),
      getAPYLido(network),
      getAPYSky(network),
      getAPYYearn(network),
    ]);
    log(network, allProtocolAPYs, gearAPY);

    const result: Record<Address, TokenDetails> = {};
    const time = moment().utc().format();

    allProtocolAPYs.forEach(apyRes => {
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

          result[address] = {
            ...tokenAPY,
            address,
            apys: [...(result[address]?.apys || []), ...apyList],
          };
        });
      }
    });

    return {
      gear:
        gearAPY.status === "fulfilled"
          ? gearAPY.value
          : { base: 0, crv: 0, gear: 0 },
      tokens: result,
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
