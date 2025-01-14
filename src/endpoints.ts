import type { Address } from "viem";
import { isAddress } from "viem";

import type { GearAPY } from "./apy";
import type { ApyDetails, Fetcher } from "./fetcher";
import type { PointsInfo } from "./points";
import type { PoolPointsInfo } from "./poolRewards";
import type { FarmInfo } from "./tokenExtraRewards";
import { isSupportedNetwork, toJSONWithBigint } from "./utils";

interface TokenOutputDetails {
  chainId: number;
  address: string;
  symbol: string;
  rewards: {
    apy: Array<ApyDetails>;
    points: Array<PointsInfo>;
    extraRewards: Array<FarmInfo>;
  };
}

interface PoolOutputDetails {
  chainId: number;
  pool: Address;

  rewards: {
    points: Array<PoolPointsInfo>;
  };
}

interface Response {
  status: string;
  description?: string;
  data?:
    | Array<TokenOutputDetails>
    | TokenOutputDetails
    | Array<PoolOutputDetails>
    | PoolOutputDetails
    | GearAPY;
}

export async function getByChainAndToken(req: any, res: any, fetcher: Fetcher) {
  const [isChainIdValid, chainId] = checkChainId(req.params.chainId);
  if (!checkResp(isChainIdValid, res)) {
    return;
  }
  const [isTokenValid, tokenAddress] = checkTokenAddress(
    req.params.tokenAddress,
  );
  if (!checkResp(isTokenValid, res)) {
    return;
  }

  const a = fetcher.cache[chainId]?.tokenApyList?.[tokenAddress as Address];
  const p = fetcher.cache[chainId]?.tokenPointsList?.[tokenAddress as Address];
  const extra =
    fetcher.cache[chainId]?.tokenExtraRewards?.[tokenAddress as Address];

  const data: TokenOutputDetails = {
    chainId: chainId,
    address: tokenAddress.toLowerCase(),
    symbol: a?.symbol || p?.symbol || "",
    rewards: {
      apy: a?.apys || [],
      points: p ? [p] : [],
      extraRewards: extra || [],
    },
  };

  res.set({ "Content-Type": "application/json" });
  res.send(toJSONWithBigint({ data: data, status: "ok" } as Response));
}

export async function getAll(req: any, res: any, fetcher: Fetcher) {
  const [isChainIdValid, chainId] = checkChainId(req.query.chain_id);
  if (!checkResp(isChainIdValid, res)) {
    return;
  }

  const data = Object.entries(
    fetcher.cache[chainId]?.tokenApyList || {},
  ).reduce<Record<Address, TokenOutputDetails>>((acc, [t, a]) => {
    acc[t as Address] = {
      chainId: chainId,
      address: t,
      symbol: a.symbol,
      rewards: {
        apy: a.apys,
        points: [],
        extraRewards: [],
      },
    };

    return acc;
  }, {});

  Object.entries(fetcher.cache[chainId]?.tokenPointsList || {}).forEach(
    ([t, p]) => {
      const token = t as Address;

      if (data[token]) {
        data[token].rewards.points.push(p);
      } else {
        data[token] = {
          chainId: chainId,
          address: t,
          symbol: p.symbol,
          rewards: {
            apy: [],
            points: [p],
            extraRewards: [],
          },
        };
      }
    },
  );

  Object.entries(fetcher.cache[chainId]?.tokenExtraRewards || {}).forEach(
    ([t, ex]) => {
      const token = t as Address;

      if (ex.length > 0) {
        if (data[token]) {
          data[token].rewards.extraRewards.push(...ex);
        } else {
          data[token] = {
            chainId: chainId,
            address: t,
            symbol: ex[0].symbol,
            rewards: {
              apy: [],
              points: [],
              extraRewards: ex,
            },
          };
        }
      }
    },
  );

  res.set({ "Content-Type": "application/json" });
  res.send(
    toJSONWithBigint({ data: Object.values(data), status: "ok" } as Response),
  );
}

export async function getRewardList(req: any, res: any, fetcher: Fetcher) {
  if (req.header("Content-Type") !== "application/json") {
    checkResp(
      {
        status: "error",
        description: "Unsupported Content-Type: use application/json",
      },
      res,
    );
  }
  const [isTokenList, tokenList] = checkTokenList(toJSONWithBigint(req.body));
  if (!checkResp(isTokenList, res)) {
    return;
  }

  const data: Array<TokenOutputDetails> = [];
  for (const t of tokenList) {
    const a =
      fetcher.cache[t.chain_id]?.tokenApyList?.[t.token_address as Address];
    const p =
      fetcher.cache[t.chain_id]?.tokenPointsList?.[t.token_address as Address];
    const extra =
      fetcher.cache[t.chain_id]?.tokenExtraRewards?.[
        t.token_address as Address
      ];

    data.push({
      chainId: t.chain_id,
      address: t.token_address.toLowerCase(),
      symbol: a?.symbol,
      rewards: {
        apy: a?.apys || [],
        points: p ? [p] : [],
        extraRewards: extra || [],
      },
    });
  }

  res.set({ "Content-Type": "application/json" });
  res.send(toJSONWithBigint({ data: data, status: "ok" } as Response));
}

export async function getGearAPY(req: any, res: any, fetcher: Fetcher) {
  const [isChainIdValid, chainId] = checkChainId(req.query.chain_id);
  if (!checkResp(isChainIdValid, res)) {
    return;
  }

  res.set({ "Content-Type": "application/json" });
  res.send(
    toJSONWithBigint({
      data: fetcher.cache[chainId]?.gear,
      status: "ok",
    } as Response),
  );
}

export async function getPoolRewards(req: any, res: any, fetcher: Fetcher) {
  const [isChainIdValid, chainId] = checkChainId(req.query.chain_id);
  if (!checkResp(isChainIdValid, res)) {
    return;
  }

  const data = Object.entries(
    fetcher.cache[chainId]?.poolPointsList || {},
  ).reduce<Record<Address, PoolOutputDetails>>((acc, [p, r]) => {
    const pool = p as Address;

    acc[pool] = {
      chainId: chainId,
      pool: pool,

      rewards: {
        points: r,
      },
    };

    return acc;
  }, {});

  res.set({ "Content-Type": "application/json" });
  res.send(
    toJSONWithBigint({
      data: Object.values(data),
      status: "ok",
    } as Response),
  );
}

function checkChainId(data: any): [Response, number] {
  const notUndefined = data ?? "0";
  if (isNaN(Number(notUndefined))) {
    return [
      {
        status: "error",
        description: "Incorrect chain_id - must be integer",
      },
      0,
    ];
  }
  const chainId = Number(notUndefined);

  if (chainId !== 0 && !isSupportedNetwork(chainId)) {
    return [
      {
        status: "error",
        description: `Unknown chain_id = ${chainId}`,
      },
      0,
    ];
  }
  return [{ status: "ok" }, chainId];
}

function checkTokenAddress(data: any): [Response, string] {
  const notUndefined = data ?? "0x";
  if (!isAddress(notUndefined)) {
    return [
      {
        status: "error",
        description: `Invalid token_address: ${data}`,
      },
      "",
    ];
  }
  return [{ status: "ok" }, notUndefined.toString()];
}

export function checkResp(res: Response, out: any): boolean {
  if (res.status === "error") {
    out.set({ "Content-Type": "application/json" });
    out.send(toJSONWithBigint(res));
    return false;
  }
  return true;
}
interface TokenRequest {
  token_ids: Array<TokenList>;
}
interface TokenList {
  token_address: string;
  chain_id: number;
}
function checkTokenList(reqBody: string): [Response, Array<TokenList>] {
  let parsedBody: TokenRequest;

  parsedBody = JSON.parse(reqBody);

  const tokenList: Array<TokenList> = [];
  for (const entry of parsedBody.token_ids) {
    const [resp, chainId] = checkChainId(entry.chain_id.toString());
    if (resp.status === "error") {
      return [resp, []];
    }
    if (chainId === 0) {
      return [
        {
          status: "error",
          description: "Unknown chain_id",
        },
        [],
      ];
    }
    const [respTokenAddr, tokenAddr] = checkTokenAddress(entry.token_address);
    if (respTokenAddr.status === "error") {
      return [respTokenAddr, []];
    }
    //
    tokenList.push({
      token_address: tokenAddr,
      chain_id: chainId,
    });
  }
  return [{ status: "ok" }, tokenList];
}
