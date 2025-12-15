import { cachedAxios } from "../../../core/app";
import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface Response {
  data: {
    machine: {
      performance: {
        apy: string;
      };
    };
  };
}

const URL = "https://api.makina-dev.finance/graphql";
const PAYLOAD = {
  query:
    'query Machine { machine(symbol: "DETH") { performance(days: 7) { apy } } }',
  variables: {},
};

const getAPYMakina: APYHandler = async network => {
  const tokens = TOKENS[network] || {};
  const tokenEntries = Object.entries(tokens).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const res = await cachedAxios.post<Response>(URL, PAYLOAD, {
    cache: {
      methods: ["post"],
    },
  });
  const { apy } = res?.data.data?.machine?.performance || {};
  const netApy = Number(apy || 0);

  const result: APYResult = {};

  if (tokens?.DETH) {
    result[tokens.DETH] = {
      address: tokens.DETH,
      symbol: "DETH",

      apys: [
        {
          address: tokens.DETH,
          symbol: "DETH",
          protocol: PROTOCOL,
          value: Number(netApy) * 100,
        },
      ],
    };
  }

  return result;
};

export { getAPYMakina };
