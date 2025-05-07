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

const getAPYSonic: APYHandler = async network => {
  const tokens = TOKENS[network];
  const tokenEntries = Object.entries(tokens).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const res = await axios.post<Response>(URL, PAYLOAD);
  const { stsGetGqlStakedSonicData } = res?.data.data || {};
  const { stakingApr = "0" } = stsGetGqlStakedSonicData || {};

  const result: APYResult = {};

  if ("stS" in tokens) {
    result[tokens.stS] = {
      address: tokens.stS,
      symbol: "stS",

      apys: [
        {
          address: tokens.stS,
          symbol: "stS",
          protocol: PROTOCOL,
          value: Number(stakingApr) * 100,
        },
      ],
    };
  }

  return result;
};

export { getAPYSonic };
