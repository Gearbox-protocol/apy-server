import type { Address } from "viem";

import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

const getAPY: APYHandler = async network => {
  const apys = TOKENS[network];

  const result = Object.entries(apys).reduce<APYResult>((acc, [addr, info]) => {
    const address = addr.toLowerCase() as Address;

    acc[address] = {
      address,
      symbol: info.symbol,

      apys: [
        {
          reward: address,
          symbol: info.symbol,
          protocol: PROTOCOL,
          value: info.apy,
        },
      ],
    };

    return acc;
  }, {});

  return result;
};

export { getAPY as getAPYConstant };
