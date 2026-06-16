import { cachedAxios } from "../../../core/axios";
import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface SavUSDResponse {
  savusdApy: string;
  lastUpdated: string;
}

interface SavETHResponse {
  apy: string;
  lastUpdated: string;
}

const getSavUSDUrl = () => "https://app.avantprotocol.com/api/savusdApy";
const getSavETHUrl = () => "https://app.avantprotocol.com/api/apy/saveth";

const getAPYAvantprotocol: APYHandler = async network => {
  const tokens = TOKENS[network] || {};
  const tokenEntries = Object.entries(tokens).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const result: APYResult = {};

  if (tokens?.savUSD) {
    const { data } = await cachedAxios.get<SavUSDResponse>(getSavUSDUrl());
    const rate = data?.savusdApy || 0;

    result[tokens.savUSD] = {
      address: tokens.savUSD,
      symbol: "savUSD",
      apys: [
        {
          address: tokens.savUSD,
          symbol: "savUSD",
          protocol: PROTOCOL,
          value: Number(rate),
        },
      ],
    };
  }

  if (tokens?.savETH) {
    const { data } = await cachedAxios.get<SavETHResponse>(getSavETHUrl());
    const rate = data?.apy || 0;

    result[tokens.savETH] = {
      address: tokens.savETH,
      symbol: "savETH",
      apys: [
        {
          address: tokens.savETH,
          symbol: "savETH",
          protocol: PROTOCOL,
          value: Number(rate),
        },
      ],
    };
  }

  return result;
};

export { getAPYAvantprotocol };
