import axios from "axios";

import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface Response {
  rate: number;
  smaApr: number;
  total_apr_teth: number;
}

const getUrl = () => "https://api.treehouse.finance/apy";

const getAPY: APYHandler = async network => {
  if (network !== "Mainnet") return {};

  const { data } = await axios.get<Response>(getUrl());

  const tokens = TOKENS[network];
  const rate = data?.total_apr_teth || 0;

  const result: APYResult = {
    [tokens.tETH]: {
      address: tokens.tETH,
      symbol: "tETH",

      apys: [
        {
          reward: tokens.tETH,
          symbol: "tETH",
          protocol: PROTOCOL,
          value: rate,
        },
      ],
    },
  };

  return result;
};

export { getAPY as getAPYTreehouse };
