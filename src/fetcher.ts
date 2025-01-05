import moment from "moment";
import type { Address } from "viem";

import {
  getAPYCurve,
  getAPYEthena,
  getAPYLama,
  getAPYLido,
  getAPYSky,
  getAPYYearn,
} from "./apy";
import type { Apy, APYResult, NetworkType, TokenAPY } from "./utils";
import { getChainId, supportedChains } from "./utils";

export type ApyDetails = Apy & { lastUpdated: string };
type TokenDetails = TokenAPY<ApyDetails>;

function log(
  network: NetworkType,
  allProtocolAPYs: Array<PromiseSettledResult<APYResult>>,
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
}
export class Fetcher {
  public cache: Record<number, Record<Address, TokenDetails>>;

  constructor() {
    this.cache = {};
  }
  async getNetworkTokens(network: NetworkType) {
    const allProtocolAPYs = await Promise.allSettled([
      getAPYCurve(network),
      getAPYEthena(network),
      getAPYLama(network),
      getAPYLido(network),
      getAPYSky(network),
      getAPYYearn(network),
    ]);
    log(network, allProtocolAPYs);

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

    return result;
  }

  async run() {
    console.log("updating fetcher");
    for (const network of Object.values(supportedChains)) {
      const chainId = getChainId(network);
      const apys = await this.getNetworkTokens(network as NetworkType);
      this.cache[chainId] = apys;
    }
  }

  async loop() {
    void this.run();
    setInterval(this.run.bind(this), 60 * 60 * 1000); // 1 hr
  }
}
