import { getChain } from "@gearbox-protocol/sdk";

import { cachedAxios } from "../../../core/axios";
import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface Response {
  data: {
    vaultByAddress: {
      state: {
        netApy: number | null;
      } | null;
    } | null;
  };
}

const URL = "https://blue-api.morpho.org/graphql";
const QUERY =
  "query getVault($address: String!, $chainId: Int) {\n  vaultByAddress(address: $address, chainId: $chainId) {\n    state {\n      netApy\n    }\n  }\n}\n";

const getAPYCoinshift: APYHandler = async network => {
  const tokens = TOKENS[network] || {};
  if (!tokens.csUSDL) return {};

  const res = await cachedAxios.post<Response>(
    URL,
    {
      operationName: "getVault",
      query: QUERY,
      variables: {
        address: tokens.csUSDL,
        chainId: getChain(network).id,
      },
    },
    {
      cache: {
        methods: ["post"],
      },
    },
  );
  const netApy = res?.data.data?.vaultByAddress?.state?.netApy || 0;

  const result: APYResult = {
    [tokens.csUSDL]: {
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
    },
  };

  return result;
};

export { getAPYCoinshift };
