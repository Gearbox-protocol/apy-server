import { cachedAxios } from "../../../core/app";
import type { APYHandler, APYResult } from "../constants";
import { getPendleAPYURL } from "../pendle";
import type { PendleResponse } from "../pendle/constants";
import { PROTOCOL, TOKENS } from "./constants";

const getAPYEthena: APYHandler = async network => {
  const tokens = TOKENS[network] || {};
  const tokenEntries = Object.entries(tokens).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const resp = await cachedAxios.get<PendleResponse>(
    getPendleAPYURL("0xcdd26eb5eb2ce0f203a84553853667ae69ca29ce", 1),
  );
  const apyInfo = resp?.data;

  const rate = apyInfo?.underlyingInterestApy || 0;

  const result: APYResult = {};

  if (tokens?.sUSDe) {
    result[tokens.sUSDe] = {
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
    };
  }

  return result;
};

export { getAPYEthena };
