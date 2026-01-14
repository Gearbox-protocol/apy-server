import type { NetworkType } from "@gearbox-protocol/sdk";
import type { Address } from "viem";
import type { PartialRecord } from "../../../core/utils";

interface PossibleAPRs {
  dgnETH?: number;
  USD3?: number;
  rgUSD?: number;
  eUSD?: number;
  hyUSD?: number;
  "ETH+"?: number;
  "USDC+"?: number;
  MAAT?: number;
  BSDX?: number;
  Vaya?: number;
  bsdETH?: number;
  iUSDC?: number;
  KNOX?: number;
}

export interface Response {
  rtokens: Record<string, PossibleAPRs>;
}

interface Info {
  address: Address;
  symbol: string;
  id: keyof PossibleAPRs;
}

export const TOKENS: PartialRecord<
  NetworkType,
  Partial<Record<keyof PossibleAPRs, Info>>
> = {
  Mainnet: {
    "ETH+": {
      address: "0xe72b141df173b999ae7c1adcbf60cc9833ce56a8",
      symbol: "ETHPlus",
      id: "ETH+",
    },
  },
};

export const PROTOCOL = "yieldsreserve";
