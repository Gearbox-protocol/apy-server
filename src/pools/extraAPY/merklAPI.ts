import type { Address } from "viem";

interface MerkleXYZChain {
  id: number;
  name: string;
  icon: string;
}

interface MerkleXYZToken {
  id: string;
  name: string;
  chainId: number;
  address: Address;
  decimals: number;
  icon: string;
  verified: boolean;
  isTest: boolean;
  price: number | null;
  symbol: string;
}

export interface MerklXYZV4Campaign {
  chainId: number;
  type: string;
  identifier: Address;
  name: string;
  status: "LIVE" | "PAST";
  action: "LEND" | "BORROW";
  tvl: number;
  apr: number;
  dailyRewards: number;
  tags: Array<string>;
  id: string;
  tokens: Array<MerkleXYZToken>;
  chain: MerkleXYZChain;
  aprRecord: {
    cumulated: number;
    timestamp: string;
    breakdowns: Array<{
      id: number;
      identifier: Address;
      type: "CAMPAIGN";
      value: number;
      aprRecordId: string;
    }>;
  };
  tvlRecord: {
    id: string;
    total: number;
    timestamp: string;
    breakdowns: [];
  };
  rewardsRecord: {
    id: string;
    total: number;
    timestamp: string;
    breakdowns: Array<{
      token: MerkleXYZToken;
      amount: string;
      id: number;
      value: number;
      campaignId: string;
      dailyRewardsRecordid: string;
    }>;
  };

  depositUrl: string;
  explorerAddress: Address;

  lastCampaignCreatedAt: string;

  protocol: {
    description: string;
    icon: string;
    id: string;
    name: string;
    tags: Array<string>;
    url: string;
  };
}
export type MerkleXYZV4CampaignsResponse = Array<MerklXYZV4Campaign>;

export interface MerklXYZV4RewardCampaign {
  id: string;
  computeChainId: number;
  distributionChainId: number;
  campaignId: Address;
  rewardTokenId: string;
  amount: string;
  opportunityId: string;
  startTimestamp: number;
  endTimestamp: number;
  creatorAddress: Address;
  params: {
    url: string;
    duration: number;
    blacklist: Array<Address>;
    whitelist: Array<Address>;
    forwarders: Array<Address>;
    targetToken: Address;
    symbolRewardToken: string;
    symbolTargetToken: string;
    decimalsRewardToken: number;
    decimalsTargetToken: number;
  };
  chain: MerkleXYZChain;
  rewardToken: MerkleXYZToken;
  distributionChain: MerkleXYZChain;
  campaignStatus: {
    campaignId: string;
    computedUntil: string;
    processingStarted: string;
    status: "SUCCESS";
    error: string;
    details: string;
  };

  createdAt: string;
  creator: {
    address: Address;
    creatorId: null;
    tags: Array<string>;
  };
  distributionType: string;
  subType: number;
  type: string;
}
export type MerkleXYZV4RewardCampaignResponse = Array<MerklXYZV4RewardCampaign>;

export class MerkleXYZApi {
  static getGearboxCampaignsUrl = () =>
    "https://api.merkl.xyz/v4/opportunities?name=gearbox";
  static getGearboxRewardCampaignUrl = (campaignId: Address) =>
    `https://api.merkl.xyz/v4/campaigns?campaignId=${campaignId}`;
}
