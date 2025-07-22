import type { Address } from "viem";

import type {
  PoolExternalAPYHandler,
  PoolExternalAPYResult,
} from "./constants";
import { POOL_EXTERNAL_APY } from "./constants";

const getPoolExternalAPY: PoolExternalAPYHandler = async network => {
  const apy = POOL_EXTERNAL_APY[network] || [];

  const result = apy.reduce<PoolExternalAPYResult>((acc, p) => {
    const pool = p.pool.toLowerCase() as Address;

    acc[pool] = [...(acc[pool] || []), { ...p, pool }];

    return acc;
  }, {});

  return result;
};

export { getPoolExternalAPY };
