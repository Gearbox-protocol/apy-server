import axios from "axios";

import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface Response {
  rate: number;
  smaApr: number;
  total_apr_teth: number;
}

const getUrl = () => "https://api.treehouse.finance/apy";

const getAPYTreehouse: APYHandler = async network => {
  const tokens = TOKENS[network];
  const tokenEntries = Object.entries(tokens).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const { data } = await axios.get<Response>(getUrl());

  const rate = data?.total_apr_teth || 0;

  const result: APYResult = {};

  if ("tETH" in tokens) {
    result[tokens.tETH] = {
      address: tokens.tETH,
      symbol: "tETH",

      apys: [
        {
          address: tokens.tETH,
          symbol: "tETH",
          protocol: PROTOCOL,
          value: rate,
        },
      ],
    };
  }

  return result;
};

export { getAPYTreehouse };
