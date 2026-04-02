import type { NetworkType } from "@gearbox-protocol/sdk";
import type { FarmInfo } from "@gearbox-protocol/sdk/rewards";
import type { Address } from "viem";
import type { PartialRecord } from "../../core/utils";

export type { FarmInfo };

export type TokenExtraRewardsResult = Record<Address, Array<FarmInfo>>;
export type TokenExtraRewardsHandler = (
  network: NetworkType,
) => Promise<TokenExtraRewardsResult>;

export const EXTRA_REWARDS_INFO: PartialRecord<
  NetworkType,
  Array<FarmInfo>
> = {};
