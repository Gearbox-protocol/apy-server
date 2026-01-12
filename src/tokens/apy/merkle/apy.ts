import type { NetworkType } from "@gearbox-protocol/sdk";
import { getChain } from "@gearbox-protocol/sdk";
import type { CacheAxiosResponse } from "axios-cache-interceptor";
import type { Address } from "viem";
import { cachedAxios } from "../../../core/axios";
import type { MerkleXYZV4CampaignsResponse } from "../../../core/merkle/merklAPI";
import { MerkleXYZApi } from "../../../core/merkle/merklAPI";
import type { PartialRecord } from "../../../core/utils";
import type { APYHandler, APYResult } from "../constants";
import type {
  CommonPayload,
  CompositePart,
  CompositePayload,
  MerklePayload,
} from "./constants";
import { PROTOCOL, TOKENS } from "./constants";

const getAPYMerkle: APYHandler = async network => {
  const tokenEntries = Object.entries(TOKENS[network] || {}).map(
    ([k, v]): [Address, MerklePayload] => [k.toLowerCase() as Address, v],
  );

  return getAPYMerkle_withFilter(network, tokenEntries);
};

const getAPYMerkle_withFilter = async (
  network: NetworkType,
  tokenEntries: Array<[Address, MerklePayload]>,
) => {
  if (tokenEntries.length === 0) return {};

  // get all campaigns
  const [additionalAPYs, ...res] = await Promise.allSettled([
    getAdditionalAPYs(network, tokenEntries),
    ...tokenEntries.map(([, c]) =>
      cachedAxios.get<MerkleXYZV4CampaignsResponse>(
        MerkleXYZApi.getOpportunitiesByAddressUrl(c.id),
      ),
    ),
  ]);

  const currentChainId = getChain(network).id;

  const allAPY = tokenEntries.reduce<APYResult>((acc, [addr, p], index) => {
    const address = addr;
    const tokenCampaignsRes = res[index];

    const merkleAPY = getCampaignAPY(currentChainId, p, tokenCampaignsRes);
    const compositeAPY = getCompositeAPY(p, additionalAPYs);

    if (merkleAPY !== null || compositeAPY !== null) {
      const apy = (merkleAPY || 0) + (compositeAPY || 0);

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

    return acc;
  }, {});

  return allAPY;
};

function getCampaignAPY(
  currentChainId: number,
  p: CommonPayload | CompositePayload,
  tokenCampaignsRes: PromiseSettledResult<
    CacheAxiosResponse<MerkleXYZV4CampaignsResponse, unknown>
  >,
) {
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
      return apy;
    }
  }

  return null;
}

function getCompositeAPY(
  p: CommonPayload | CompositePayload,
  additionalAPYs: PromiseSettledResult<
    PartialRecord<CompositePart["handler"]["type"], APYResult>
  >,
) {
  if (p.type !== "composite") return null;
  if (additionalAPYs.status !== "fulfilled") return null;

  const totalComposite = p.tokens.reduce<number>((acc, t) => {
    const additionalAPY =
      additionalAPYs.value?.[t.handler.type]?.[t.token]?.apys[0]?.value;
    return acc + (additionalAPY || 0) * t.fraction;
  }, 0);

  return totalComposite > 0 ? totalComposite : null;
}

type HandlerTypes = CompositePart["handler"]["type"];
type GettersList = PartialRecord<HandlerTypes, [HandlerTypes, APYHandler]>;

async function getAdditionalAPYs(
  network: NetworkType,
  tokenEntries: (readonly [Address, CommonPayload | CompositePayload])[],
) {
  const uniqueGetters = tokenEntries.reduce<GettersList>((acc, [_, v]) => {
    if (v.type === "composite") {
      v.tokens.forEach(t => {
        acc[t.handler.type] = [t.handler.type, t.handler.getter];
      });
    }

    return acc;
  }, {});

  const list = Object.values(uniqueGetters);

  const additionalRes = await Promise.allSettled(
    list.map(([_, getter]) => getter(network)),
  );

  const additionalAPYs = additionalRes.reduce<
    PartialRecord<HandlerTypes, APYResult>
  >((acc, r, index) => {
    const [type] = list[index];

    if (r && r.status === "fulfilled") {
      acc[type] = r.value;
    }

    return acc;
  }, {});

  return additionalAPYs;
}

export { getAPYMerkle, getAPYMerkle_withFilter };
