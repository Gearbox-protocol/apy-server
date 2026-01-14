import type { NetworkType } from "@gearbox-protocol/sdk";
import type { Address } from "viem";

export interface Apy {
  address: Address;
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
