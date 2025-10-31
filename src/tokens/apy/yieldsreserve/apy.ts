import { cachedAxios } from "../../../core/app";
import { getChainId } from "../../../core/chains";
import { json_stringify } from "../../../core/utils";
import type { APYHandler, APYResult } from "../constants";
import type { Response } from "./constants";
import { PROTOCOL, TOKENS } from "./constants";

const getUrl = () => "https://yields.reserve.org";

const getAPYYieldsreserve: APYHandler = async network => {
  const tokens = TOKENS[network] || {};
  const tokenEntries = Object.entries(tokens).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const currentChainId = getChainId(network);

  const { data } = await cachedAxios.get<Response>(getUrl());

  const result: APYResult = {};

  tokenEntries.forEach(([, tokenInfo]) => {
    const apr = data?.rtokens?.[currentChainId]?.[tokenInfo.id] || 0;

    result[tokenInfo.address] = {
      address: tokenInfo.address,
      symbol: tokenInfo.symbol,

      apys: [
        {
          address: tokenInfo.address,
          symbol: tokenInfo.symbol,
          protocol: PROTOCOL,
          value: Number(apr),
        },
      ],
    };
  });

  return result;
};

export { getAPYYieldsreserve };
