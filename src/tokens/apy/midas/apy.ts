import { cachedAxios } from "../../../core/app";
import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface Response {
  mbasis: number;
  mtbill: number;
  mbtc: number;
  medge: number;
  mmev: number;
  mre7: number;
  msl: number;
  mfone: number;
  hypeusd: number;
  hypebtc: number;
  hypeeth: number;
  tbtc: number;
  tusde: number;
  teth: number;
  hbusdt: number;
  hbxaut: number;
}

const getUrl = () => "https://api-prod.midas.app/api/data/apys";

const getAPYMidas: APYHandler = async network => {
  const tokens = TOKENS[network];
  const tokenEntries = Object.entries(tokens).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const { data } = await cachedAxios.get<Response>(getUrl());

  const mBASISRate = data?.mbasis || 0;
  const mTBILLRate = data?.mtbill || 0;

  const result: APYResult = {};

  if (tokens?.mBASIS) {
    result[tokens.mBASIS] = {
      address: tokens.mBASIS,
      symbol: "mBASIS",

      apys: [
        {
          address: tokens.mBASIS,
          symbol: "mBASIS",
          protocol: PROTOCOL,
          value: Number(mBASISRate) * 100,
        },
      ],
    };
  }

  if (tokens?.mTBILL) {
    result[tokens.mTBILL] = {
      address: tokens.mTBILL,
      symbol: "mTBILL",

      apys: [
        {
          address: tokens.mTBILL,
          symbol: "mTBILL",
          protocol: PROTOCOL,
          value: Number(mTBILLRate) * 100,
        },
      ],
    };
  }

  return result;
};

export { getAPYMidas };
