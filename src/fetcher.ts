import { getCurveAPY, getYearnAPY, TokenAPY, getLidoAPY, getSkyAPY, getPendleAPY, getDefiLamaAPY, ApyDetails } from './apy';
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
        const [...allProtocolAPYs] = await Promise.all([
            getCurveAPY(network),
            getYearnAPY(network),
            getSkyAPY(network),
            getPendleAPY(network),
            getLidoAPY(network),
            getDefiLamaAPY(network),
        ]);
        let protocols = ["Curve", "Yearn", "Sky", "Pendle", "Lido", "Defillama"];
        let s = "";
        for (var ind in protocols) {
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
        let time = moment().utc().format();;
        allProtocolAPYs.forEach((networkAPY, networkInd) => {
            Object.entries(networkAPY).forEach(([token, newAPYs]) => {
                newAPYs?.apys.forEach((entry: ApyDetails) => {
                    entry.lastUpdated = time;
                    entry.protocol = protocols[networkInd]
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



