import { cachedAxios } from "../../../core/axios";
import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface Response {
  mtbill: number;
  mbasis: number;
  mbtc: number;
  medge: number;
  mre7: number;
  mre7sol: number;
  mmev: number;
  msl: number;
  mfone: number;
  mhyper: number;
  mapollo: number;
  hbusdt: number;
  hbxaut: number;
  hypeeth: number;
  hypebtc: number;
  hypeusd: number;
  teth: number;
  tusde: number;
  tbtc: number;
  mevbtc: number;
  lsthype: number;
  liquidhype: number;
  hbusdc: number;
  mfarm: number;
  wvlp: number;
  dnhype: number;
  kmiusd: number;
  msyrupusd: number;
  dnpump: number;
  zerogusdv: number;
  zerogethv: number;
  zerogbtcv: number;
  jiv: number;
  mre7btc: number;
  kitusd: number;
  kithype: number;
  kitbtc: number;
  dnfart: number;
  mxrp: number;
  msyrupusdp: number;
  acrembtc1: number;
  mwildusd: number;
  tacton: number;
  plusd: number;
  splusd: number;
  wnlp: number;
  dneth: number;
  dntest: number;
  obeatusd: number;
  mevusd: number;
  cusdo: number;
  mhypereth: number;
  mhyperbtc: number;
}

const getUrl = () => "https://api-prod.midas.app/api/data/apys";

const getAPYMidas: APYHandler = async network => {
  const tokens = TOKENS[network] || {};
  const tokenEntries = Object.entries(tokens).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const { data } = await cachedAxios.get<Response>(getUrl());

  const mBASISRate = data?.mbasis || 0;
  const mTBILLRate = data?.mtbill || 0;
  const mRe7YIELDRate = data?.mre7 || 0;
  const mEDGERate = data?.medge || 0;

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

  if (tokens?.mRe7YIELD) {
    result[tokens.mRe7YIELD] = {
      address: tokens.mRe7YIELD,
      symbol: "mRe7YIELD",

      apys: [
        {
          address: tokens.mRe7YIELD,
          symbol: "mRe7YIELD",
          protocol: PROTOCOL,
          value: Number(mRe7YIELDRate) * 100,
        },
      ],
    };
  }

  if (tokens?.mEDGE) {
    result[tokens.mEDGE] = {
      address: tokens.mEDGE,
      symbol: "mEDGE",

      apys: [
        {
          address: tokens.mEDGE,
          symbol: "mEDGE",
          protocol: PROTOCOL,
          value: Number(mEDGERate) * 100,
        },
      ],
    };
  }

  return result;
};

export { getAPYMidas };
