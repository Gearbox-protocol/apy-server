import moment from "moment";
import type { Address } from "viem";

import type { ApyDetails, TokenAPY } from "./apy";
import {
  getCurveAPY,
  getDefiLamaAPY,
  getLidoAPY,
  getPendleAPY,
  getSkyAPY,
  getYearnAPY,
} from "./apy";
import { TokenStore } from "./apy/token_store";
import type { APYResult, NetworkType } from "./utils";
import { CHAINS, supportedChains } from "./utils";

function log(
  network: NetworkType,
  protocols: string[],
  allProtocolAPYs: APYResult[],
) {
  // logs

  const list = allProtocolAPYs.map((apyRes, index) => {
    const tokens = Object.entries(apyRes)
      .map(([_, v]) => v.symbol)
      .join(", ");
    const protocol = protocols[index];

    if (tokens !== "") {
      console.log(`${protocol}: ${tokens}`);
    }

    return `${protocol}: ${Object.keys(apyRes).length}`;
  });

  console.log(`Fetched ${list} for ${network}`);
}
export class Fetcher {
  public cache: Record<number, Record<Address, TokenAPY>>;
  store: TokenStore;

  constructor() {
    this.cache = {};
    this.store = new TokenStore();
  }
  async getnetworkTokens(network: NetworkType) {
    let ans: Record<Address, TokenAPY> = {};
    const [...allProtocolAPYs] = await Promise.all([
      getCurveAPY(network, this.store),
      getYearnAPY(network),
      getSkyAPY(network, this.store),
      getPendleAPY(network, this.store),
      getLidoAPY(network, this.store),
      getDefiLamaAPY(network, this.store),
    ]);
    let protocols = ["Curve", "Yearn", "Sky", "Pendle", "Lido", "Defillama"];
    log(network, protocols, allProtocolAPYs);

    let time = moment().utc().format();
    allProtocolAPYs.forEach((networkAPY, networkInd) => {
      Object.entries(networkAPY).forEach(([token, newAPYs]) => {
        newAPYs?.apys.forEach((entry: ApyDetails) => {
          entry.lastUpdated = time;
          entry.protocol = protocols[networkInd];
          entry.reward = entry.reward.toLowerCase() as Address;
        });
        //
        let tokenAddr = token.toLowerCase() as Address;
        if (tokenAddr in ans) {
          ans[tokenAddr]?.apys.push(...(newAPYs?.apys || []));
        } else {
          ans[tokenAddr] = newAPYs!;
        }
      });
    });
    return ans;
  }

  async run() {
    console.log("updating fetcher");
    for (let network of Object.values(supportedChains)) {
      let chainId = CHAINS[network as NetworkType];
      let apys = await this.getnetworkTokens(network as NetworkType);
      this.cache[chainId] = apys;
    }
  }

  async loop() {
    void this.run();
    setInterval(this.run.bind(this), 60 * 60 * 1000); // 1 hr
  }
}
