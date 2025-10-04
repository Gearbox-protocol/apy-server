import type { Address } from "viem";

import { cachedAxios } from "../../../core/app";
import { getChainId } from "../../../core/chains";
import type { MerkleXYZV4CampaignsResponse } from "../../../core/merkle/merklAPI";
import { MerkleXYZApi } from "../../../core/merkle/merklAPI";
import { json_stringify } from "../../../core/utils";
import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

const getAPYMerkle: APYHandler = async network => {
  const tokenEntries = Object.entries(TOKENS[network] || {}).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  // get all campaigns
  const res = await Promise.allSettled(
    tokenEntries.map(([, c]) =>
      cachedAxios.get<MerkleXYZV4CampaignsResponse>(
        MerkleXYZApi.getOpportunitiesByAddressUrl(c.id),
      ),
    ),
  );

  const currentChainId = getChainId(network);

  const allAPY = tokenEntries.reduce<APYResult>((acc, [addr, p], index) => {
    const address = addr as Address;
    const tokenCampaignsRes = res[index];

    if (tokenCampaignsRes && tokenCampaignsRes.status === "fulfilled") {
      // filter out not active
      const currentActiveCampaigns = tokenCampaignsRes.value.data.filter(
        c =>
          c.status === "LIVE" &&
          c.chainId === currentChainId &&
          c.identifier.toLowerCase() === p.id.toLowerCase(),
      );

      if (currentActiveCampaigns.length > 0) {
        const apy = currentActiveCampaigns[0]?.apr;

        acc[address] = {
          address,
          symbol: p.symbol,

          apys: [
            {
              address: address,
              symbol: p.symbol,
              protocol: PROTOCOL,
              value: apy || 0,
            },
          ],
        };
      }
    }

    return acc;
  }, {});

  return allAPY;
};

export { getAPYMerkle };
