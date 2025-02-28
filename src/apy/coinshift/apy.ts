import axios from "axios";

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

const getAPY: APYHandler = async network => {
  const tokens = TOKENS[network];
  if (!tokens || !("csUSDL" in tokens)) return {};

  const res = await axios.post<Response>(URL, PAYLOAD);
  const { state, asset } = res?.data.data?.vault || {};
  const { netApy = 0 } = state || {};
  const { apr = 0 } = asset?.yield || {};

  const result: APYResult = {
    [tokens.csUSDL]: {
      address: tokens.csUSDL,
      symbol: "csUSDL",

      apys: [
        {
          reward: tokens.csUSDL,
          symbol: "csUSDL",
          protocol: PROTOCOL,
          value: Number(netApy + apr) * 100,
        },
      ],
    },
  };

  return result;
};

export { getAPY as getAPYCoinshift };
