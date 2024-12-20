import { getCurveAPY, getYearnAPY, TokenAPY, getLidoAPY, getSkyAPY, getPendleAPY, ApyDetails } from './apy';
import {
    NetworkType,
    supportedChains,
    CHAINS,
} from "@gearbox-protocol/sdk-gov";
import moment from 'moment';

import { Address } from "viem";

export class Fetcher {
    public cache: Record<number, Record<Address, TokenAPY>>

    constructor() {
        this.cache = {};
    }
    async getnetworkTokens(network: NetworkType) {
        let ans: Record<Address, TokenAPY> = {};
        const [...allNetworkAPYs] = await Promise.all([
            getCurveAPY(network),
            getYearnAPY(network),
            getSkyAPY(network),
            getPendleAPY(network),
            getLidoAPY(network),
        ]);
        let protocols = ["Curve", "yearn", "Sky", "Pendle", "Lido"];
        let s = "";
        for (var ind in protocols) {
            s += ` ${protocols[ind]}:${Object.keys(allNetworkAPYs[ind]).length} `
        }
        console.log(`Fetched ${s} for ${network}`)
        let time = moment().utc().format();;
        allNetworkAPYs.forEach((networkAPY) => {
            Object.entries(networkAPY).forEach(([token, newAPYs]) => {
                newAPYs?.apys.forEach((entry: ApyDetails) => {
                    entry.lastUpdated = time;
                    // entry.symbol = entry.symbol.toLowerCase();
                })
                //
                let tokenAddr = token as Address;
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
        for (var network of supportedChains) {
            if (network == "Base") {
                continue;
            }
            let chainId = CHAINS[network as NetworkType];
            let apys = await this.getnetworkTokens(network as NetworkType);
            this.cache[chainId] = apys;
        }
    }


}



