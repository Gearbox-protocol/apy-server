import type { Address } from "viem";

import type { NetworkType } from "../utils";

export type TokenExtraRewardsResult = Record<Address, Array<FarmInfo>>;
export type TokenExtraRewardsHandler = (
  network: NetworkType,
) => Promise<TokenExtraRewardsResult>;

export interface FarmInfo {
  token: Address;

  rewardToken: Address;
  rewardSymbol: string;

  duration: bigint;
  finished: bigint;

  reward: bigint;
  balance: bigint;
}

const MAX_TIMESTAMP = 1738022400n;

export const EXTRA_REWARDS_INFO: Record<NetworkType, Array<FarmInfo>> = {
  Mainnet: [],
  Optimism: [
    {
      token: "0x2416092f143378750bb29b79eD961ab195CcEea5", // ezETH
      rewardToken: "0x4200000000000000000000000000000000000042",
      rewardSymbol: "OP",

      finished: MAX_TIMESTAMP,
      duration: BigInt(45 * 24 * 60 * 60),
      reward: 5000n * 10n ** 18n,
      balance: 0n,
    },
  ],
  Arbitrum: [],
};
