import { cachedAxios } from "../../../core/axios";
import type { APYHandler, APYResult } from "../constants";
import { PROTOCOL, TOKENS } from "./constants";

interface Response {
  data: {
    CoreVault_TotalRewardsClaimedPerDay: [
      { startTimestamp: string; dailyAPR: string },
    ];
  };
}

const URL = "https://indexer.hyperindex.xyz/a7dd119/v1/graphql";
const PAYLOAD = {
  operationName: "sumRewards24h",
  query: `
  query sumRewards24h {
    CoreVault_TotalRewardsClaimedPerDay (
      order_by: { startTimestamp: desc }
      limit: 1
    ) {
      startTimestamp,
      dailyAPR
    }
  }`,
  variables: {},
};

const getAPYMagma: APYHandler = async network => {
  const tokens = TOKENS[network] || {};
  const tokenEntries = Object.entries(tokens).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const res = await cachedAxios.post<Response>(URL, PAYLOAD, {
    cache: {
      methods: ["post"],
    },
  });
  const { dailyAPR } =
    res?.data.data?.CoreVault_TotalRewardsClaimedPerDay?.[0] || {};
  const netApy = Number(dailyAPR || 0);

  const result: APYResult = {};

  if (tokens?.gMON) {
    result[tokens.gMON] = {
      address: tokens.gMON,
      symbol: "gMON",

      apys: [
        {
          address: tokens.gMON,
          symbol: "gMON",
          protocol: PROTOCOL,
          value: Number(netApy) / 100,
        },
      ],
    };
  }

  return result;
};

export { getAPYMagma };
