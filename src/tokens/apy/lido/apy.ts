import type { Address } from "viem";

import { cachedAxios } from "../../../core/app";
import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface Apy {
  timeUnix: number;
  apr: number;
}

interface Meta {
  address: Address;
  chainId: number;
  symbol: string;
}

interface Response {
  data: {
    aprs: Array<Apy>;
    smaApr: number;
  };
  meta: Meta;
}

const LIDO_URL = "https://eth-api.lido.fi/v1/protocol/steth/apr/sma";

const getAPYLido: APYHandler = async network => {
  const tokenEntries = Object.entries(TOKENS[network] || {}).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const res = await cachedAxios.get<Response>(LIDO_URL);
  const { smaApr = 0 } = res?.data?.data || {};

  const result = tokenEntries.reduce<APYResult>((acc, [addr, symbol]) => {
    const address = addr as Address;

    acc[address] = {
      address,
      symbol: symbol,

      apys: [
        {
          address: address,
          symbol: symbol,
          protocol: PROTOCOL,
          value: smaApr,
        },
      ],
    };

    return acc;
  }, {});

  return result;
};

export { getAPYLido };
