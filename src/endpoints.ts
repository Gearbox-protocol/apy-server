import type { Address } from "viem";
import { isAddress } from "viem";

import type { GearAPY } from "./apy";
import type { ApyDetails, Fetcher } from "./fetcher";
import type { PointsInfo } from "./points/constants";
import { isSupportedNetwork, toJSONWithBigint } from "./utils";

interface Response {
  status: string;
  description?: string;
  data?: Array<OutputDetails> | OutputDetails | GearAPY;
}

interface OutputDetails {
  chainId: number;
  address: string;
  symbol: string;
  rewards: {
    apy: Array<ApyDetails>;
    points: Array<PointsInfo>;
  };
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

  const a = fetcher.cache[chainId]?.apyList?.[tokenAddress as Address];
  const p = fetcher.cache[chainId]?.pointsList?.[tokenAddress as Address];

  const data: OutputDetails = {
    chainId: chainId,
    address: tokenAddress.toLowerCase(),
    symbol: a?.symbol || p?.symbol || "",
    rewards: {
      apy: a?.apys || [],
      points: p ? [p] : [],
    },
  };

  res.set({ "Content-Type": "application/json" });
  res.send(toJSONWithBigint({ data: data, status: "ok" } as Response));
  //
}

export async function getAll(req: any, res: any, fetcher: Fetcher) {
  const [isChainIdValid, chainId] = checkChainId(req.query.chain_id);
  if (!checkResp(isChainIdValid, res)) {
    return;
  }

  const data = Object.entries(fetcher.cache[chainId]?.apyList || {}).reduce<
    Record<Address, OutputDetails>
  >((acc, [t, a]) => {
    acc[t as Address] = {
      chainId: chainId,
      address: t,
      symbol: a.symbol,
      rewards: {
        apy: a.apys,
        points: [],
      },
    };

    return acc;
  }, {});

  Object.entries(fetcher.cache[chainId]?.pointsList || {}).forEach(([t, p]) => {
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
        },
      };
    }
  });

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

  const data: Array<OutputDetails> = [];
  for (const t of tokenList) {
    const a = fetcher.cache[t.chain_id]?.apyList?.[t.token_address as Address];
    const p =
      fetcher.cache[t.chain_id]?.pointsList?.[t.token_address as Address];

    data.push({
      chainId: t.chain_id,
      address: t.token_address.toLowerCase(),
      symbol: a?.symbol,
      rewards: {
        apy: a?.apys || [],
        points: p ? [p] : [],
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
