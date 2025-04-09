import axios from "axios";

import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface Response {
  underlyingInterestApy: number;
}

// get ethena apy using pendle api
const getAPYURL = () =>
  "https://api-v2.pendle.finance/core/v2/1/markets/0xcdd26eb5eb2ce0f203a84553853667ae69ca29ce/data";

const getAPY: APYHandler = async network => {
  const tokens = TOKENS[network];
  if (!tokens || !("sUSDe" in tokens)) return {};

  const resp = await axios.get<Response>(getAPYURL());
  const apyInfo = resp?.data;

  const rate = apyInfo?.underlyingInterestApy || 0;

  const result: APYResult = {
    [tokens.sUSDe]: {
      address: tokens.sUSDe,
      symbol: "sUSDe",

      apys: [
        {
          address: tokens.sUSDe,
          symbol: "sUSDe",
          protocol: PROTOCOL,
          value: Number(rate) * 100,
        },
      ],
    },
  };

  return result;
};

export { getAPY as getAPYEthena };
