import { cachedAxios } from "../../../core/axios";
import type { PartialRecord } from "../../../core/utils";
import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

type Response = Array<{
  id: string;
  chain_id: number;
  address: string;
  symbol: string;
  decimals: number;
  name: string;

  apr: number;
}>;

const getUrl = () => "https://points.mellow.finance/v1/vaults";

const getAPYMellowVaults: APYHandler = async network => {
  const tokens = TOKENS[network] || {};
  const tokenEntries = Object.entries(tokens).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const { data } = await cachedAxios.get<Response>(getUrl());

  const record = data.reduce<PartialRecord<string, Response[number]>>(
    (acc, info) => {
      acc[info.id] = info;
      return acc;
    },
    {},
  );

  const lskETHRate = record?.["lisk-wsteth-vault"]?.apr || 0;

  const result: APYResult = {};

  if (tokens?.lskETH) {
    result[tokens.lskETH] = {
      address: tokens.lskETH,
      symbol: "lskETH",

      apys: [
        {
          address: tokens.lskETH,
          symbol: "lskETH",
          protocol: PROTOCOL,
          value: lskETHRate,
        },
      ],
    };
  }

  return result;
};

export { getAPYMellowVaults };
