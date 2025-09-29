import type { Address } from "viem";

import { cachedAxios } from "../../../core/app";
import type { APYHandler, APYResult } from "../constants";
import type { PendleResponse } from "./constants";
import { PROTOCOL, TOKENS } from "./constants";

export const getPendleAPYURL = (id: Address, chainId: number) =>
  `https://api-v2.pendle.finance/core/v2/${chainId}/markets/${id}/data`;

const getAPYPendle: APYHandler = async network => {
  const tokenEntries = Object.entries(TOKENS[network] || {}).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  // get all campaigns
  const res = await Promise.allSettled(
    tokenEntries.map(([, c]) =>
      cachedAxios.get<PendleResponse>(getPendleAPYURL(c.id, c.chainId)),
    ),
  );

  const allAPY = tokenEntries.reduce<APYResult>((acc, [addr, p], index) => {
    const address = addr as Address;
    const r = res[index];

    if (r && r.status === "fulfilled") {
      const rate = r?.value?.data?.[p.field] || 0;

      acc[address] = {
        address,
        symbol: p.symbol,

        apys: [
          {
            address: address,
            symbol: p.symbol,
            protocol: PROTOCOL,
            value: Number(rate) * 100,
          },
        ],
      };
    }

    return acc;
  }, {});

  return allAPY;
};

export { getAPYPendle };
