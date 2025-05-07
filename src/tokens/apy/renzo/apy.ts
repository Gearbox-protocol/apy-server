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
  const tokens = TOKENS[network];
  if (!tokens || !("ezETH" in tokens)) return {};

  const { data } = await axios.get<Response>(getUrl());

  const rate = data?.data?.apr?.data?.rate || 0;

  const result: APYResult = {
    [tokens.ezETH]: {
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
    },
  };

  return result;
};

export { getAPYRenzo };
