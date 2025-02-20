import axios from "axios";

import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface Response {
  data: { stsGetGqlStakedSonicData: { stakingApr: string } };
}

const URL = "https://api-v3.balancer.fi/";
const PAYLOAD = {
  query: "{\n  stsGetGqlStakedSonicData {\n    stakingApr\n  }\n}",
};

const getAPY: APYHandler = async network => {
  const tokens = TOKENS[network];
  if (!("stS" in tokens)) return {};

  const res = await axios.post<Response>(URL, PAYLOAD);
  const { stsGetGqlStakedSonicData } = res?.data.data || {};
  const { stakingApr = "0" } = stsGetGqlStakedSonicData || {};

  const result: APYResult = {
    [tokens.stS]: {
      address: tokens.stS,
      symbol: "stS",

      apys: [
        {
          reward: tokens.stS,
          symbol: "stS",
          protocol: PROTOCOL,
          value: Number(stakingApr) * 100,
        },
      ],
    },
  };

  return result;
};

export { getAPY as getBalancer };
