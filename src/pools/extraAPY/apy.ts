import type { AxiosResponse } from "axios";
import axios from "axios";
import moment from "moment";
import type { Address } from "viem";

import type {
  PoolExtraApy,
  PoolExtraAPYHandler,
  PoolExtraAPYResultByChain,
} from "./constants";
import { BROKEN_CAMPAIGNS } from "./constants";
import type {
  MerkleXYZV4CampaignsResponse,
  MerkleXYZV4RewardCampaignResponse,
  MerklXYZV4RewardCampaign,
} from "./merklAPI";
import { MerkleXYZApi } from "./merklAPI";

export const getPoolExtraAPY: PoolExtraAPYHandler = async () => {
  // get all campaigns
  const res = await axios.get<MerkleXYZV4CampaignsResponse>(
    MerkleXYZApi.getGearboxCampaignsUrl(),
  );
  // filter out not active
  const currentActiveCampaigns = res.data.filter(
    c => c.status === "LIVE" && !BROKEN_CAMPAIGNS[c.id],
  );

  // we can't definitely connect an apr from aprRecord.breakdowns to a token if there are multiple rewards
  // so we need to get all aprIds for campaigns with multiple rewards and then get the campaign by aprId
  const aprIdsList = currentActiveCampaigns
    .map(c =>
      c.aprRecord.breakdowns.map(b => {
        return {
          campaignId: c.id,
          aprId: b.identifier,
        };
      }),
    )
    .flat(1);

  const aprIdsResponse: Array<
    PromiseSettledResult<AxiosResponse<MerkleXYZV4RewardCampaignResponse, any>>
  > = [];

  for (const id of aprIdsList) {
    const resp = await Promise.allSettled([
      axios.get<MerkleXYZV4RewardCampaignResponse>(
        MerkleXYZApi.getGearboxRewardCampaignUrl(id.aprId),
      ),
    ]);
    aprIdsResponse.push(...resp);
  }

  const aprCampaignByAPRId = aprIdsResponse.reduce<
    Record<Address, Array<MerklXYZV4RewardCampaign> | undefined>
  >((acc, r, i) => {
    const id = aprIdsList[i].aprId;
    acc[id] = r.status === "fulfilled" ? r.value.data : undefined;

    return acc;
  }, {});

  const time = moment().utc().format();

  const r = currentActiveCampaigns.reduce<PoolExtraAPYResultByChain>(
    (acc, campaign) => {
      // reward source can be either campaign.tokens[0]?.address for a single source, or campaign.identifier
      const rewardSource = campaign.identifier.toLowerCase() as Address;

      const allRewards = campaign.aprRecord.breakdowns
        .map((r, i) => {
          const apy = r.value;

          const aprCampaign = aprCampaignByAPRId[r.identifier]?.[0];
          const { rewardToken } = aprCampaign || {};
          const tokenRewardsRecord =
            campaign.rewardsRecord.breakdowns[i]?.token;

          // if aprCampaign is not defined use possibly wrong token from  breakdowns[i]?.token
          const { address = tokenRewardsRecord?.address || "" } =
            rewardToken || {};

          const tokenLc = address.toLowerCase() as Address;
          const symbol =
            rewardToken?.symbol || tokenRewardsRecord?.symbol || "";

          const apyObject: PoolExtraApy = {
            token: rewardSource,

            apy: apy,
            rewardToken: tokenLc,
            rewardTokenSymbol: symbol,
            endTimestamp: aprCampaign?.endTimestamp
              ? Number(aprCampaign.endTimestamp)
              : undefined,

            lastUpdated: time,
          };

          return apyObject;
        })
        .filter(r => r.apy > 0);

      if (!acc[campaign.chain.id]) acc[campaign.chain.id] = {};
      acc[campaign.chain.id][rewardSource] = [
        ...(acc[campaign.chain.id]?.[rewardSource] || []),
        ...allRewards,
      ];

      return acc;
    },
    {},
  );

  return r;
};
