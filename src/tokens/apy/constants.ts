import type { NetworkType } from "@gearbox-protocol/sdk";
import type { Apy } from "@gearbox-protocol/sdk/rewards";
import type { Address } from "viem";

export interface TokenAPY<A = Apy> {
  address: Address;
  symbol: string;
  apys: Array<A>;
}

export type APYResult = Record<Address, TokenAPY>;
export type APYHandler = (network: NetworkType) => Promise<APYResult>;
