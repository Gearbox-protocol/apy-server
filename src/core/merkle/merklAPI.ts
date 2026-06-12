import type { Address } from "viem";
import { cachedAxios } from "../axios";
import { MERKL_API_KEY } from "../config";

interface MerkleXYZChain {
  id: number;
  name: string;
  icon: string;
  liveCampaigns?: number;
  endOfDisputePeriod?: number | string;
  lastClaimsOnchainFetchTimestamp?: string;
  explorers?: Array<{
    id: string | number;
    type: string;
    url: string;
    chainId: number;
  }>;
}

interface MerkleXYZToken {
  id: string;
  name: string;
  chainId: number;
  address: Address;
  decimals: number;
  icon: string;
  verified: boolean;
  isNative?: boolean;
  isTest: boolean;
  type?: string;
  price: number | null;
  symbol: string;
  updatedAt?: number;
  priceSource?: string;
  displaySymbol?: string;
}

export interface MerklXYZV4Campaign {
  chainId: number;
  type: string;
  identifier: Address;
  name: string;
  description?: string;
  howToSteps?: Array<string>;
  status: "LIVE" | "PAST";
  action: string;
  tvl: number;
  apr: number;
  maxApr?: number;
  dailyRewards: number;
  maxDailyRewards?: number;
  tags: Array<string>;
  liveCampaigns?: number;
  earliestCampaignStart?: string;
  latestCampaignStart?: string;
  earliestCampaignEnd?: string;
  latestCampaignEnd?: string;
  id: string;
  tokens: Array<MerkleXYZToken>;
  chain: MerkleXYZChain;
  aprRecord: {
    cumulated: number;
    timestamp: string;
    breakdowns: Array<{
      id?: number;
      identifier: Address;
      type: "CAMPAIGN";
      value: number;
      aprRecordId?: string;
      distributionType?: string;
      timestamp?: string;
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
      maxAmount?: string;
      id?: string | number;
      value: number;
      maxValue?: number;
      campaignId?: string;
      dailyRewardsRecordid?: string;
      dailyRewardsRecordId?: string;
      distributionType?: string;
      onChainCampaignId?: Address;
      timestamp?: string;
    }>;
  };

  depositUrl: string;
  explorerAddress: Address;

  lastCampaignCreatedAt: number | string;

  protocol: {
    id: string;
    name: string;
    description?: string;
    icon: string;
    tags: Array<string>;
    url: string;
    banner?: string | null;
    opportunityBannerLight?: string | null;
    opportunityBannerDark?: string | null;
  };
}
export type MerkleXYZV4CampaignsResponse = Array<MerklXYZV4Campaign>;

export interface MerklXYZV4RewardCampaign {
  id: string;
  computeChainId: number;
  distributionChainId: number;
  campaignId: Address;
  type?: string;
  subType?: number;
  rewardTokenId: string;
  amount: string;
  opportunityId: string;
  startTimestamp: number;
  endTimestamp: number;
  dailyRewards?: number;
  apr?: number;
  creatorAddress: Address;
  isPrivate?: boolean;
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
    hooks?: Array<unknown>;
    forwardingList?: Array<unknown>;
    forwardingEnabled?: boolean;
    computeScoreParameters?: {
      computeMethod: string;
    };
    distributionMethodParameters?: {
      distributionMethod: string;
      distributionSettings: Record<string, unknown>;
    };
  };
  chain: MerkleXYZChain;
  rewardToken: MerkleXYZToken;
  distributionChain: MerkleXYZChain;
  distributionType?: string;
  campaignStatus: {
    campaignId: string;
    computedUntil: string;
    processingStarted: string;
    status: "SUCCESS" | string;
    error: string;
    details: string;
    preComputeStatus?: string;
    delay?: number;
    preComputeProcessingStarted?: number | string;
    createdAt?: number;
  };

  createdAt: string | number;
  creator: {
    address: Address;
    creatorId: string | null;
    tags: Array<string>;
    googleSub?: string | null;
    email?: string | null;
    tier?: number;
    maxNegativeBalance?: number;
    missingCreatorAlertDismissedAt?: string | null;
  };
}
export type MerkleXYZV4RewardCampaignResponse = Array<MerklXYZV4RewardCampaign>;

export class MerkleXYZApi {
  private constructor() {}

  static defaultDomain = "https://api.merkl.xyz";
  static angleDomain = "https://api-merkl.angle.money";

  static getOpportunitiesByAddressUrl = (a: Address) => (domain: string) =>
    `${domain}/v4/opportunities?search=${a}`;

  static getGearboxCampaignsUrl =
    () =>
    (domain = MerkleXYZApi.defaultDomain) =>
      `${domain}/v4/opportunities?mainProtocolId=gearbox`;

  static getGearboxRewardCampaignUrl =
    (campaignId: Address) => (domain: string) =>
      `${domain}/v4/campaigns?campaignId=${campaignId}`;

  private static get headers(): Record<string, string> | undefined {
    return MERKL_API_KEY ? { "X-API-Key": MERKL_API_KEY } : undefined;
  }

  static fetchWithFallback = async <T>(getUrl: (domain: string) => string) => {
    const headers = MerkleXYZApi.headers;
    try {
      return await cachedAxios.get<T>(getUrl(MerkleXYZApi.defaultDomain), {
        headers,
      });
    } catch {
      return await cachedAxios.get<T>(getUrl(MerkleXYZApi.angleDomain), {
        headers,
      });
    }
  };
}
