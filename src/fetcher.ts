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

function log(network: NetworkType, allProtocolAPYs: APYResult[]) {
  // logs

  const list = allProtocolAPYs.map(apyRes => {
    const entries = Object.entries(apyRes);
    const tokens = entries.map(([_, v]) => v.symbol).join(", ");

    const protocol = entries[0]?.[1]?.apys?.[0]?.protocol || "unknown";

    if (tokens !== "") {
      console.log(`${protocol}: ${tokens}`);
    }

    return `${protocol}: ${Object.keys(apyRes).length}`;
  });

  console.log(`Fetched ${list} for ${network}`);
}
export class Fetcher {
  public cache: Record<number, Record<Address, TokenDetails>>;

  constructor() {
    this.cache = {};
  }
  async getNetworkTokens(network: NetworkType) {
    const [...allProtocolAPYs] = await Promise.all([
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

    allProtocolAPYs.forEach(networkAPY => {
      Object.entries(networkAPY).forEach(([addr, tokenAPY]) => {
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
