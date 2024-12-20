import {
    NetworkType,
    PartialRecord,
} from "@gearbox-protocol/sdk-gov";
import { Address } from "viem";
export interface ApyDetails {
    reward: Address,
    symbol: string,
    value: number,
    lastUpdated?: string
}
export interface TokenAPY {
    symbol: string,
    apys: ApyDetails[]
}

export function getTokenAPY(sym: string, apys: ApyDetails[]) {
    return {
        symbol: sym,
        apys: apys,
    }
}
export type APYResult = PartialRecord<Address, TokenAPY>;