import { cachedAxios } from "../../../core/app";
import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface Response {
  data: {
    vault: {
      state: {
        netApy: number;
      };
      asset: {
        yield: {
          apr: number;
        };
      };
    };
  };
}

const URL = "https://blue-api.morpho.org/graphql";
const PAYLOAD = {
  operationName: "getVaults",
  query:
    "query getVaults($vaultId: String!) {\n  vault(id: $vaultId) {\n    state {\n      netApy\n    }\n    asset {\n      yield {\n        apr\n      }\n    }\n  }\n}\n",
  variables: {
    vaultId: "1246b945-7527-414d-bd4b-39d96ee8f67c",
  },
};

const getAPYCoinshift: APYHandler = async network => {
  const tokens = TOKENS[network];
  const tokenEntries = Object.entries(tokens).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const res = await cachedAxios.post<Response>(URL, PAYLOAD, {
    cache: {
      methods: ["post"],
    },
  });
  const { state } = res?.data.data?.vault || {};
  const { netApy = 0 } = state || {};

  const result: APYResult = {};

  if (tokens?.csUSDL) {
    result[tokens.csUSDL] = {
      address: tokens.csUSDL,
      symbol: "csUSDL",

      apys: [
        {
          address: tokens.csUSDL,
          symbol: "csUSDL",
          protocol: PROTOCOL,
          value: Number(netApy) * 100,
        },
      ],
    };
  }

  return result;
};

export { getAPYCoinshift };
