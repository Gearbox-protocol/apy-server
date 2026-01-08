import { cachedAxios } from "../../../core/axios";
import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface Response {
  "7d_apy": string;
}

const getUrl = () => "https://api.falcon.finance/api/v1/statistics";

const getAPYFalcon: APYHandler = async network => {
  const tokens = TOKENS[network] || {};
  const tokenEntries = Object.entries(tokens).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const { data } = await cachedAxios.get<Response>(getUrl());

  const sUSDfRate = Number(data?.["7d_apy"] || 0);

  const result: APYResult = {};

  if (tokens?.sUSDf) {
    result[tokens.sUSDf] = {
      address: tokens.sUSDf,
      symbol: "sUSDf",

      apys: [
        {
          address: tokens.sUSDf,
          symbol: "sUSDf",
          protocol: PROTOCOL,
          value: Number(sUSDfRate) * 100,
        },
      ],
    };
  }

  return result;
};

export { getAPYFalcon };
