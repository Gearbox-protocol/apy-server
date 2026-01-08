import type { Address } from "viem";

import { cachedAxios } from "../../../core/axios";
import type { APYHandler, APYResult } from "../constants";
import type { UpshiftTokenizedVaultResponse } from "./constants";
import { PROTOCOL, TOKENS } from "./constants";

const getUrl = (token: Address) =>
  `https://api.upshift.finance/v1/tokenized_vaults/${token}`;

const getAPYUpshift: APYHandler = async network => {
  const tokenEntries = Object.entries(TOKENS[network] || {}).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const res = await Promise.allSettled(
    tokenEntries.map(([, c]) =>
      cachedAxios.get<UpshiftTokenizedVaultResponse>(getUrl(c.id)),
    ),
  );

  const allAPY = tokenEntries.reduce<APYResult>((acc, [addr, p], index) => {
    const address = addr as Address;

    const currentRes = res[index];
    const r = currentRes?.status === "fulfilled" ? currentRes.value : null;
    const rate = r?.data?.historical_apy?.[7] || 0;

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

    return acc;
  }, {});

  return allAPY;
};

export { getAPYUpshift };
