import type { Address } from "viem";

import type {
  TokenExtraRewardsHandler,
  TokenExtraRewardsResult,
} from "./constants";
import { EXTRA_REWARDS_INFO } from "./constants";

// extra apy on top of base apy
const getTokenExtraRewards: TokenExtraRewardsHandler = async network => {
  const rewards = EXTRA_REWARDS_INFO[network] || [];

  const result = rewards.reduce<TokenExtraRewardsResult>((acc, p) => {
    const address = p.address.toLowerCase() as Address;
    const rewardToken = p.rewardToken.toLowerCase() as Address;

    acc[address] = [...(acc[address] || []), { ...p, address, rewardToken }];

    return acc;
  }, {});

  return result;
};

export { getTokenExtraRewards };
