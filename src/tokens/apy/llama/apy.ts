import axios from "axios";
import type { Address } from "viem";

import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface LamaItem {
  apy: number;
  apyBase: number;

  chain: string;
  pool: string;
  symbol: string;
  project: string;
}

const getDefillamaURL = () => "https://yields.llama.fi/pools";

interface LamaResponse {
  data: Array<LamaItem>;
  status: string;
}

const getAPYLama: APYHandler = async network => {
  const tokenEntries = Object.entries(TOKENS[network] || {}).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const res = await axios.get<LamaResponse>(getDefillamaURL());
  const poolById = res.data.data.reduce<Record<string, LamaItem>>((acc, p) => {
    acc[p.pool] = p;
    return acc;
  }, {});

  const allAPY = tokenEntries.reduce<APYResult>((acc, [addr, p]) => {
    const address = addr as Address;
    const pool = poolById[p.id] || {};

    if (pool) {
      acc[address] = {
        address,
        symbol: p.symbol,

        apys: [
          {
            address: address,
            symbol: p.symbol,
            protocol: PROTOCOL,
            value: pool.apy || 0,
          },
        ],
      };
    }

    return acc;
  }, {});

  return allAPY;
};

export { getAPYLama };
