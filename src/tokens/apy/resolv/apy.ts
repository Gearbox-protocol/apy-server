import { cachedAxios } from "../../../core/app";
import { RESOLV_AUTH_TOKEN } from "../../../core/utils";
import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface Response {
  interval: string;
  value: number;
}

const getUrl = () => "https://external-api.resolv.xyz/apr/rlp?interval=7d";
const getStakingUrl = () =>
  "https://external-api.resolv.xyz/apr/staking?interval=7d";

const REQUEST_CONFIG = {
  withCredentials: true,
  headers: {
    Accept: "application/json",
    apikey: RESOLV_AUTH_TOKEN,
  },
} as const;

const getAPYResolv: APYHandler = async network => {
  const tokens = TOKENS[network] || {};
  const tokenEntries = Object.entries(tokens).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const [data, stakingData] = await Promise.all([
    cachedAxios.get<Response>(getUrl(), REQUEST_CONFIG),
    cachedAxios.get<Response>(getStakingUrl(), REQUEST_CONFIG),
  ]);

  const rplRate = Number(data?.data?.value || 0);
  const wstUSRRate = Number(stakingData?.data?.value || 0);

  const result: APYResult = {};

  if (tokens?.RLP) {
    result[tokens.RLP] = {
      address: tokens.RLP,
      symbol: "RLP",

      apys: [
        {
          address: tokens.RLP,
          symbol: "RLP",
          protocol: PROTOCOL,
          value: Number(rplRate) * 100,
        },
      ],
    };
  }

  if (tokens?.wstUSR) {
    result[tokens.wstUSR] = {
      address: tokens.wstUSR,
      symbol: "wstUSR",

      apys: [
        {
          address: tokens.wstUSR,
          symbol: "wstUSR",
          protocol: PROTOCOL,
          value: Number(wstUSRRate) * 100,
        },
      ],
    };
  }

  return result;
};

export { getAPYResolv };
