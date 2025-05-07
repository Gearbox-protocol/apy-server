import axios from "axios";

import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface Response {
  success: boolean;
  data: {
    apr: {
      success: boolean;
      data: {
        rate: number;
        avgPeriodDays: number;
      };
      pzETHAPR: {
        rate: number;
        avgPeriodDays: number;
      };
    };
  };
}

const getUrl = () => "https://app.renzoprotocol.com/api/stats";

const getAPYRenzo: APYHandler = async network => {
  const tokenEntries = Object.entries(TOKENS[network] || {}).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const { data } = await axios.get<Response>(getUrl());

  const rate = data?.data?.apr?.data?.rate || 0;
  const pzRate = data?.data?.apr?.pzETHAPR?.rate || 0;

  const tokens = TOKENS[network];

  const result: APYResult = {};

  if ("ezETH" in tokens) {
    result[tokens.ezETH] = {
      address: tokens.ezETH,
      symbol: "ezETH",

      apys: [
        {
          address: tokens.ezETH,
          symbol: "ezETH",
          protocol: PROTOCOL,
          value: rate,
        },
      ],
    };
  }

  if ("pzETH" in tokens) {
    result[tokens.pzETH] = {
      address: tokens.pzETH,
      symbol: "pzETH",

      apys: [
        {
          address: tokens.pzETH,
          symbol: "pzETH",
          protocol: PROTOCOL,
          value: pzRate,
        },
      ],
    };
  }

  return result;
};

export { getAPYRenzo };
