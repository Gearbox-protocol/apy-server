import type { Address } from "viem";

import type {
  TokenExtraCollateralAPYHandler,
  TokenExtraCollateralAPYResult,
} from "./constants";
import { EXTRA_APY } from "./constants";

// allows rewrite base apy of a token for a pool in absolute or relative manner
const getTokenExtraCollateralAPY: TokenExtraCollateralAPYHandler =
  async network => {
    const rewards = EXTRA_APY[network];

    const result = rewards.reduce<TokenExtraCollateralAPYResult>((acc, p) => {
      const token = p.token.toLowerCase() as Address;
      const pool = p.pool.toLowerCase() as Address;

      acc[token] = [...(acc[token] || []), { ...p, token, pool }];

      return acc;
    }, {});

    return result;
  };

export { getTokenExtraCollateralAPY };
