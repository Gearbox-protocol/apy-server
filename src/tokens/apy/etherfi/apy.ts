import { cachedAxios } from "../../../core/app";
import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface Response {
  "7_day_apr": number;
  "7_day_restaking_apr": number;
  tvl: number;
  buffer_eth: number;
}

const getUrl = () => "https://app.ether.fi/api/protocol/protocol-detail";

const getAPYEtherfi: APYHandler = async network => {
  const tokens = TOKENS[network];
  const tokenEntries = Object.entries(tokens).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const { data } = await cachedAxios.get<Response>(getUrl());

  const apr7D = data?.["7_day_apr"] || 0;
  const restakingAPR7D = data?.["7_day_restaking_apr"] || 0;

  const rate = apr7D / 0.9 + restakingAPR7D;

  const result: APYResult = {};

  if (tokens?.weETH) {
    result[tokens.weETH] = {
      address: tokens.weETH,
      symbol: "weETH",

      apys: [
        {
          address: tokens.weETH,
          symbol: "weETH",
          protocol: PROTOCOL,
          value: rate,
        },
      ],
    };
  }

  return result;
};

export { getAPYEtherfi };
