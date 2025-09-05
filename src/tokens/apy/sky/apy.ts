import { cachedAxios } from "../../../core/app";
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
  const tokens = TOKENS[network] || {};
  const tokenEntries = Object.entries(tokens).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const resp = await cachedAxios.get<Response>(getURL());
  const apyInfo = resp?.data?.[0];

  const savingsRate = apyInfo?.sky_savings_rate_apy || 0;
  const farmRate = apyInfo?.sky_farm_apy || 0;

  const result: APYResult = {};

  if (tokens?.sUSDS) {
    result[tokens.sUSDS] = {
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
    };
  }

  if (tokens?.stkUSDS) {
    result[tokens.stkUSDS] = {
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
    };
  }

  if (tokens?.stkUSDS_inv) {
    result[tokens.stkUSDS_inv] = {
      address: tokens.stkUSDS_inv,
      symbol: "stkUSDS_inv",
      apys: [
        {
          address: tokens.stkUSDS_inv,
          symbol: "stkUSDS_inv",
          protocol: PROTOCOL,
          value: Number(farmRate) * 100,
        },
      ],
    };
  }

  return result;
};

export { getAPYSky };
