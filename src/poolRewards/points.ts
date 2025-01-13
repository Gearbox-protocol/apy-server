import type { Address } from "viem";

import type { PoolPointsHandler, PoolPointsResult } from "../utils";
import { POOL_POINTS } from "./constants";

const getPoolPoints: PoolPointsHandler = async network => {
  const points = POOL_POINTS[network];

  const result = points.reduce<PoolPointsResult>((acc, p) => {
    const token = p.token.toLowerCase() as Address;
    const pool = p.pool.toLowerCase() as Address;

    acc[pool] = [...(acc[pool] || []), { ...p, pool, token }];

    return acc;
  }, {});

  return result;
};

export { getPoolPoints };
