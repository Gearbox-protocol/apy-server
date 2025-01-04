import axios from "axios";
import type { Address } from "viem";

import type { APYHandler, APYResult } from "../../utils";
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

const getAPY: APYHandler = async network => {
  const tokens = TOKENS[network];
  const tokensList = Object.entries(tokens);
  if (tokensList.length === 0) return {};

  const res = await axios.get<LamaResponse>(getDefillamaURL());
  const poolById = res.data.data.reduce<Record<string, LamaItem>>((acc, p) => {
    acc[p.pool] = p;
    return acc;
  }, {});

  const allAPY = tokensList.reduce<APYResult>((acc, [addr, poolId]) => {
    const address = addr as Address;
    const pool = poolById[poolId] || {};

    if (pool) {
      acc[address] = {
        address,
        symbol: pool.symbol,

        apys: [
          {
            reward: address,
            symbol: pool.symbol,
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

export { getAPY as getAPYLama };
