import type { Address } from "viem";

import type { NetworkType } from "../utils";

export interface Apy {
  reward: Address;
  symbol: string;
  protocol: string;

  value: number;
}

export interface TokenAPY<A = Apy> {
  address: Address;
  symbol: string;

  apys: Array<A>;
}

export type APYResult = Record<Address, TokenAPY>;
export type APYHandler = (network: NetworkType) => Promise<APYResult>;
