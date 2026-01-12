import type { Address } from "viem";

import type {
  TokenExtraCollateralAPYHandler,
  TokenExtraCollateralAPYResult,
} from "./constants";
import { EXTRA_APY } from "./constants";

// allows rewrite base apy of a token for a pool in absolute or relative manner
const getTokenExtraCollateralAPY: TokenExtraCollateralAPYHandler =
  async network => {
    const rewards = EXTRA_APY[network] || [];

    const apyResponse = await Promise.allSettled(
      rewards.map(p => p.value.getter(network)),
    );

    const result = rewards.reduce<TokenExtraCollateralAPYResult>(
      (acc, { value: _, ...p }, index) => {
        const address = p.address.toLowerCase() as Address;
        const pool = p.pool.toLowerCase() as Address;

        const resp = apyResponse[index];
        const value = resp?.status === "fulfilled" ? resp.value : 0;

        acc[address] = [
          ...(acc[address] || []),
          { ...p, address, pool, value },
        ];

        return acc;
      },
      {},
    );

    return result;
  };

export { getTokenExtraCollateralAPY };
