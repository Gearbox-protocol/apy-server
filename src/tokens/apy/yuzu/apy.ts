import { cachedAxios } from "../../../core/axios";
import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface Response {
  yzpp_apy: number;
  syzusd_apy: number;
}

const getUrl = () => "https://defi-api.yuzu.money/proxy/apy";

const getAPYYuzu: APYHandler = async network => {
  const tokens = TOKENS[network] || {};
  const tokenEntries = Object.entries(tokens).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const { data } = await cachedAxios.get<Response>(getUrl());

  const syzusdApy = Number(data?.syzusd_apy || 0);

  const result: APYResult = {};

  if (tokens?.syzUSD) {
    result[tokens.syzUSD] = {
      address: tokens.syzUSD,
      symbol: "syzUSD",

      apys: [
        {
          address: tokens.syzUSD,
          symbol: "syzUSD",
          protocol: PROTOCOL,
          value: Number(syzusdApy),
        },
      ],
    };
  }

  return result;
};

export { getAPYYuzu };
