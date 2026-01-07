import type { AxiosResponse } from "axios";
import moment from "moment";
import type { Address } from "viem";

import { cachedAxios } from "../../core/app";
import type {
  MerkleXYZV4CampaignsResponse,
  MerkleXYZV4RewardCampaignResponse,
  MerklXYZV4Campaign,
  MerklXYZV4RewardCampaign,
} from "../../core/merkle/merklAPI";
import { MerkleXYZApi } from "../../core/merkle/merklAPI";
import type {
  PoolExtraAPYHandler,
  PoolExtraAPYResultByChain,
  PoolExtraApy,
} from "./constants";
import { BROKEN_CAMPAIGNS } from "./constants";

const IDS_TO_OMIT = {
  ["0x381d2c99a313d3c9e8d727c38dd7f34f6c3062003a3ddf015396e9a15f1bb386".toLowerCase()]: true,
};

export const getPoolExtraAPY: PoolExtraAPYHandler = async () => {
  // get all campaigns
  const res = await cachedAxios.get<MerkleXYZV4CampaignsResponse>(
    MerkleXYZApi.getGearboxCampaignsUrl(),
  );
  // filter out not active
  const currentActiveCampaigns = res.data.filter(
    c => c.status === "LIVE" && !BROKEN_CAMPAIGNS[c.id],
  );

  // we can't definitely connect an apr from aprRecord.breakdowns to a token if there are multiple rewards
  // so we need to get all aprIds for campaigns with multiple rewards and then get the campaign by aprId
  const aprIdsList = currentActiveCampaigns.flatMap(c =>
    getBreakdowns(c).map(b => {
      return {
        campaignId: c.id,
        aprId: b.identifier,
      };
    }),
  );

  const aprIdsResponse: Array<
    PromiseSettledResult<AxiosResponse<MerkleXYZV4RewardCampaignResponse, any>>
  > = [];
  for (const id of aprIdsList) {
    const resp = await Promise.allSettled([
      cachedAxios.get<MerkleXYZV4RewardCampaignResponse>(
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
        .reduce<Array<PoolExtraApy>>((accInner, r, i) => {
          if (isAPRToOmit(r)) return accInner;

          const apy = r.value;

          const aprCampaign = aprCampaignByAPRId[r.identifier]?.[0];
          const { rewardToken } = aprCampaign || {};
          const tokenRewardsRecord =
            campaign.rewardsRecord.breakdowns[i]?.token;

          // if aprCampaign is not defined use possibly wrong token from  rewardsRecord.breakdowns[i]?.token
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

          accInner.push(apyObject);

          return accInner;
        }, [])
        .filter(r => r && r.apy > 0);

      if (!acc[campaign.chain.id]) acc[campaign.chain.id] = {};
      acc[campaign.chain.id][rewardSource] = [
        ...(acc[campaign.chain.id]?.[rewardSource] || []),
        ...allRewards,
      ];

      return acc;
    },
    {},
  );

  const currentDisabledCampaigns = res.data.filter(
    c => c.status === "PAST" && !BROKEN_CAMPAIGNS[c.id],
  );
  currentDisabledCampaigns.forEach(campaign => {
    const rewardSource = campaign.identifier.toLowerCase() as Address;

    if (!r[campaign.chain.id]) r[campaign.chain.id] = {};
    if (!r[campaign.chain.id][rewardSource]) {
      r[campaign.chain.id][rewardSource] = [];
    }
  });

  return r;
};

function getBreakdowns(c: MerklXYZV4Campaign) {
  return c.aprRecord.breakdowns.filter(b => !isAPRToOmit(b));
}
function isAPRToOmit(
  apr: MerklXYZV4Campaign["aprRecord"]["breakdowns"][number],
) {
  return IDS_TO_OMIT[apr.identifier.toLowerCase()];
}
