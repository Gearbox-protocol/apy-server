import type { Address } from "viem";

import { cachedAxios } from "../../../core/app";
import { getChainId } from "../../../core/chains";
import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface APYData {
  apr: {
    netAPR: number;
  };

  address: Address;
  symbol: string;
  display_name: string;
}

type Response = Array<APYData>;

const getUrl = (chainId: number) =>
  `https://ydaemon.yearn.fi/vaults/all?chainids=${chainId}&limit=2500`;

const getAPYYearn: APYHandler = async network => {
  const chainId = getChainId(network);
  const tokenEntries = Object.entries(TOKENS[network] || {}).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );

  if (tokenEntries.length === 0) return {};

  const { data } = await cachedAxios.get<Response>(getUrl(chainId));

  const tokens = Object.fromEntries(tokenEntries) as Record<Address, string>;

  const result = data.reduce<APYResult>((acc, d) => {
    const addr = d.address.toLowerCase() as Address;

    const symbol = tokens[addr];
    if (symbol) {
      const netApy = d?.apr?.netAPR || 0;

      acc[d.address] = {
        address: d.address,
        symbol,

        apys: [
          {
            address: d.address,
            symbol,
            protocol: PROTOCOL,
            value: Number(netApy) * 100,
          },
        ],
      };
    }

    return acc;
  }, {});

  return result;
};

export { getAPYYearn };
