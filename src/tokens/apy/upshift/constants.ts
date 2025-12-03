import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";
import type { PartialRecord } from "../../../core/utils";

export const PROTOCOL = "upshift";

export interface UpshiftTokenizedVaultResponse {
  historical_apy: { 1: number; 7: number };
}

interface Payload {
  id: Address;
  symbol: string;
  token: Address;
  field: "historical_apy";
}

export const TOKENS: PartialRecord<NetworkType, Record<Address, Payload>> = {
  Monad: {
    "0xd793c04b87386a6bb84ee61d98e0065fde7fda5e": {
      id: "0xD793c04B87386A6bb84ee61D98e0065FdE7fdA5E",
      symbol: "sAUSD",
      token: "0xd793c04b87386a6bb84ee61d98e0065fde7fda5e",
      field: "historical_apy",
    },
  },
};
