import { cachedAxios } from "../../../core/app";
import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface Response {
  savusdApy: string;
  lastUpdated: string;
}

const getUrl = () => "https://app.avantprotocol.com/api/savusdApy";

const getAPYAvantprotocol: APYHandler = async network => {
  const tokens = TOKENS[network] || {};
  const tokenEntries = Object.entries(tokens).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const { data } = await cachedAxios.get<Response>(getUrl());

  const rate = data?.savusdApy || 0;

  const result: APYResult = {};

  if (tokens?.savUSD) {
    result[tokens.savUSD] = {
      address: tokens.savUSD,
      symbol: "savUSD",

      apys: [
        {
          address: tokens.savUSD,
          symbol: "savUSD",
          protocol: PROTOCOL,
          value: Number(rate),
        },
      ],
    };
  }

  return result;
};

export { getAPYAvantprotocol };
