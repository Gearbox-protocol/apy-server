import axios from "axios";
import type { Address } from "viem";

import type { APYHandler, APYResult } from "../../utils";
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

const getAPY: APYHandler = async network => {
  const res = await axios.get<Response>(LIDO_URL);
  const { smaApr = 0 } = res?.data?.data || {};

  const tokens = TOKENS[network];

  const result = Object.entries(tokens).reduce<APYResult>(
    (acc, [addr, symbol]) => {
      const address = addr as Address;

      acc[address] = {
        address,
        symbol: symbol,

        apys: [
          {
            reward: address,
            symbol: symbol,
            protocol: PROTOCOL,
            value: smaApr,
          },
        ],
      };

      return acc;
    },
    {},
  );

  return result;
};

export { getAPY as getAPYLido };
