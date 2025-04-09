import type { Address } from "viem";

import type {
  ExtraCollateralPointsHandler,
  TokenExtraCollateralPointsResult,
} from "./constants";
import { POINTS_INFO_BY_NETWORK } from "./constants";

const getTokenExtraCollateralPoints: ExtraCollateralPointsHandler =
  async network => {
    const points = POINTS_INFO_BY_NETWORK[network];

    const result = points.reduce<TokenExtraCollateralPointsResult>((acc, p) => {
      const address = p.address.toLowerCase() as Address;
      const pool = p.pool.toLowerCase() as Address;

      acc[address] = {
        ...p,
        address,
        pool,
        ...(p.debtRewards
          ? {
              debtRewards: p.debtRewards.map(r => ({
                ...r,
                cm: r.cm.toLowerCase() as Address,
              })),
            }
          : {}),
      };

      return acc;
    }, {});

    return result;
  };

export { getTokenExtraCollateralPoints };
