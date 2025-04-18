import axios from "axios";
import type { Address } from "viem";

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
  `https://ydaemon.yearn.finance/vaults/all?chainids=${chainId}&limit=2500`;

const getAPY: APYHandler = async network => {
  const chainId = getChainId(network);
  const { data } = await axios.get<Response>(getUrl(chainId));

  const tokens = Object.fromEntries(
    Object.entries(TOKENS[network]).map(([k, v]) => [k.toLowerCase(), v]),
  ) as Record<Address, string>;

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

export { getAPY as getAPYYearn };
