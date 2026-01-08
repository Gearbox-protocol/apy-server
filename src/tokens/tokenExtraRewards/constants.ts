import type { NetworkType } from "@gearbox-protocol/sdk";
import type { Address } from "viem";
import type { PartialRecord } from "../../core/utils";

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

export const EXTRA_REWARDS_INFO: PartialRecord<
  NetworkType,
  Array<FarmInfo>
> = {};
