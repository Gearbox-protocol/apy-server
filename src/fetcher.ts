import { getCurveAPY, getYearnAPY, TokenAPY, getLidoAPY, getSkyAPY, getPendleAPY, getDefiLamaAPY, ApyDetails } from './apy';
import { TokenStore } from './apy/token_store';
import {
    NetworkType,
    supportedChains,
    CHAINS,
    APYResult,
} from "./apy/type";
import moment from 'moment';

import { Address } from "viem";

function log(network: NetworkType, protocols: string[], allProtocolAPYs: APYResult[]) {
    // logs

    let s = "";
    for (var ind in allProtocolAPYs) {
        let t = "";
        Object.entries(allProtocolAPYs[ind]).forEach(([k, v]) => {
            t += v?.symbol + ", "
        })
        s += ` ${protocols[ind]}:${Object.keys(allProtocolAPYs[ind]).length} `
        if (t != "") {
            console.log(protocols[ind] + ": " + t)
        }
    }
    console.log(`Fetched ${s} for ${network}`)
    //
}
export class Fetcher {
    public cache: Record<number, Record<Address, TokenAPY>>
    store: TokenStore

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
        log(network, protocols, allProtocolAPYs)

        let time = moment().utc().format();;
        allProtocolAPYs.forEach((networkAPY, networkInd) => {
            Object.entries(networkAPY).forEach(([token, newAPYs]) => {
                newAPYs?.apys.forEach((entry: ApyDetails) => {
                    entry.lastUpdated = time;
                    entry.protocol = protocols[networkInd]
                    entry.reward = entry.reward.toLowerCase() as Address;
                })
                //
                let tokenAddr = token.toLowerCase() as Address;
                if (tokenAddr in ans) {
                    ans[tokenAddr]?.apys.push(...(newAPYs?.apys!));
                } else {
                    ans[tokenAddr] = newAPYs!;
                }
            })
        });
        return ans;
    }


    async run() {
        for (var network of Object.values(supportedChains)) {
            let chainId = CHAINS[network as NetworkType];
            let apys = await this.getnetworkTokens(network as NetworkType);
            this.cache[chainId] = apys;
        }
    }


}



