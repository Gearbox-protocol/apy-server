import type { Address } from "viem";

import type { NetworkType } from "../../core/chains";

export type TokenExtraRewardsResult = Record<Address, Array<FarmInfo>>;
export type TokenExtraRewardsHandler = (
  network: NetworkType,
) => Promise<TokenExtraRewardsResult>;

export interface FarmInfo {
  address: Address;
  symbol: string;

  rewardToken: Address;
  rewardSymbol: string;

  duration: bigint;
  finished: bigint;

  reward: bigint;
  balance: bigint;
}

export const EXTRA_REWARDS_INFO: Record<NetworkType, Array<FarmInfo>> = {
  Mainnet: [],
  Optimism: [],
  Arbitrum: [],
  Base: [],
  Sonic: [],

  Monad: [],
  MegaETH: [],
  Berachain: [],
  Avalanche: [],
};
