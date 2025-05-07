import axios from "axios";

import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

type Response = [
  {
    sky_savings_rate_apy: string;
    sky_farm_apy: string;
  },
];

const getURL = () => "https://info-sky.blockanalitica.com/api/v1/overall/";

const getAPYSky: APYHandler = async network => {
  const tokens = TOKENS[network];
  if (!tokens || !("sUSDS" in tokens)) return {};

  const resp = await axios.get<Response>(getURL());
  const apyInfo = resp?.data?.[0];

  const savingsRate = apyInfo?.sky_savings_rate_apy || 0;
  const farmRate = apyInfo?.sky_farm_apy || 0;

  const result: APYResult = {
    [tokens.sUSDS]: {
      address: tokens.sUSDS,
      symbol: "sUSDS",

      apys: [
        {
          address: tokens.sUSDS,
          symbol: "sUSDS",
          protocol: PROTOCOL,
          value: Number(savingsRate) * 100,
        },
      ],
    },
    [tokens.stkUSDS]: {
      address: tokens.stkUSDS,
      symbol: "stkUSDS",
      apys: [
        {
          address: tokens.stkUSDS,
          symbol: "stkUSDS",
          protocol: PROTOCOL,
          value: Number(farmRate) * 100,
        },
      ],
    },
  };

  return result;
};

export { getAPYSky };
