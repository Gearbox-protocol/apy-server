import { captureException } from "@sentry/node";
import type { Address } from "viem";
import { isAddress } from "viem";

import type { GearAPY } from "./apy";
import type { ApyDetails, Fetcher } from "./fetcher";
import type { PointsInfo } from "./points";
import type { PoolPointsInfo } from "./poolRewards/points";
import type { ExtraCollateralAPY } from "./tokenExtraCollateralAPY";
import type { ExtraCollateralPointsInfo } from "./tokenExtraCollateralPoints";
import type { FarmInfo } from "./tokenExtraRewards";
import { isSupportedNetwork, toJSONWithBigint } from "./utils";

interface TokenOutputDetails {
  chainId: number;
  address: string;
  symbol: string;
  rewards: {
    apy: Array<Omit<ApyDetails, "symbol" | "address">>;
    points: Array<Omit<PointsInfo, "symbol" | "address">>;
    extraRewards: Array<Omit<FarmInfo, "symbol" | "address">>;
    extraCollateralAPY: Array<Omit<ExtraCollateralAPY, "symbol" | "address">>;
    extraCollateralPoints: Array<
      Omit<ExtraCollateralPointsInfo, "symbol" | "address">
    >;
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

function removeSymbolAndAddress<T extends { address: Address; symbol: string }>(
  l: Array<T>,
): Array<Omit<T, "address" | "symbol">> {
  return l.map(({ symbol, address, ...rest }) => rest);
}

export function getByChainAndToken(req: any, res: any, fetcher: Fetcher) {
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
  const extraCollateralAPY =
    fetcher.cache[chainId]?.tokenExtraCollateralAPY?.[tokenAddress as Address];
  const extraCollateralPoints =
    fetcher.cache[chainId]?.tokenExtraCollateralPoints?.[
      tokenAddress as Address
    ];

  const data: TokenOutputDetails = {
    chainId: chainId,
    address: tokenAddress.toLowerCase(),
    symbol: a?.symbol || p?.symbol || "",
    rewards: {
      apy: removeSymbolAndAddress(a?.apys || []),
      points: removeSymbolAndAddress(p ? [p] : []),
      extraRewards: removeSymbolAndAddress(extra || []),
      extraCollateralAPY: removeSymbolAndAddress(extraCollateralAPY || []),
      extraCollateralPoints: removeSymbolAndAddress(
        extraCollateralPoints ? [extraCollateralPoints] : [],
      ),
    },
  };

  res.set({ "Content-Type": "application/json" });
  res.send(toJSONWithBigint({ data: data, status: "ok" } as Response));
}

export function getAll(req: any, res: any, fetcher: Fetcher) {
  const [isChainIdValid, chainId] = checkChainId(req.query.chain_id);
  if (!checkResp(isChainIdValid, res)) {
    return;
  }

  const data = Object.entries(
    fetcher.cache[chainId]?.tokenApyList || {},
  ).reduce<Record<Address, TokenOutputDetails>>((acc, [t, a]) => {
    const cleared = removeSymbolAndAddress(a.apys);

    acc[t as Address] = {
      chainId: chainId,
      address: t,
      symbol: a.symbol,
      rewards: {
        apy: cleared,
        points: [],
        extraRewards: [],
        extraCollateralAPY: [],
        extraCollateralPoints: [],
      },
    };

    return acc;
  }, {});

  Object.entries(fetcher.cache[chainId]?.tokenPointsList || {}).forEach(
    ([t, p]) => {
      const token = t as Address;
      const cleared = removeSymbolAndAddress([p]);

      if (data[token]) {
        data[token].rewards.points.push(...cleared);
      } else {
        data[token] = {
          chainId: chainId,
          address: t,
          symbol: p.symbol,
          rewards: {
            apy: [],
            points: cleared,
            extraRewards: [],
            extraCollateralAPY: [],
            extraCollateralPoints: [],
          },
        };
      }
    },
  );

  Object.entries(fetcher.cache[chainId]?.tokenExtraRewards || {}).forEach(
    ([t, ex]) => {
      const token = t as Address;
      const cleared = removeSymbolAndAddress(ex);

      if (ex.length > 0) {
        if (data[token]) {
          data[token].rewards.extraRewards.push(...cleared);
        } else {
          data[token] = {
            chainId: chainId,
            address: t,
            symbol: ex[0].symbol,
            rewards: {
              apy: [],
              points: [],
              extraRewards: cleared,
              extraCollateralAPY: [],
              extraCollateralPoints: [],
            },
          };
        }
      }
    },
  );

  Object.entries(fetcher.cache[chainId]?.tokenExtraCollateralAPY || {}).forEach(
    ([t, ex]) => {
      const token = t as Address;
      const cleared = removeSymbolAndAddress(ex);

      if (ex.length > 0) {
        if (data[token]) {
          data[token].rewards.extraCollateralAPY.push(...cleared);
        } else {
          data[token] = {
            chainId: chainId,
            address: t,
            symbol: ex[0].symbol,
            rewards: {
              apy: [],
              points: [],
              extraRewards: [],
              extraCollateralAPY: cleared,
              extraCollateralPoints: [],
            },
          };
        }
      }
    },
  );

  Object.entries(
    fetcher.cache[chainId]?.tokenExtraCollateralPoints || {},
  ).forEach(([t, p]) => {
    const token = t as Address;
    const cleared = removeSymbolAndAddress([p]);

    if (data[token]) {
      data[token].rewards.extraCollateralPoints.push(...cleared);
    } else {
      data[token] = {
        chainId: chainId,
        address: t,
        symbol: p.symbol,
        rewards: {
          apy: [],
          points: [],
          extraRewards: [],
          extraCollateralAPY: [],
          extraCollateralPoints: cleared,
        },
      };
    }
  });

  res.set({ "Content-Type": "application/json" });
  res.send(
    toJSONWithBigint({ data: Object.values(data), status: "ok" } as Response),
  );
}

export function getRewardList(req: any, res: any, fetcher: Fetcher) {
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
    const extraCollateralAPY =
      fetcher.cache[t.chain_id]?.tokenExtraCollateralAPY?.[
        t.token_address as Address
      ];
    const extraCollateralPoints =
      fetcher.cache[t.chain_id]?.tokenExtraCollateralPoints?.[
        t.token_address as Address
      ];

    data.push({
      chainId: t.chain_id,
      address: t.token_address.toLowerCase(),
      symbol: a?.symbol,
      rewards: {
        apy: removeSymbolAndAddress(a?.apys || []),
        points: removeSymbolAndAddress(p ? [p] : []),
        extraRewards: removeSymbolAndAddress(extra || []),
        extraCollateralAPY: removeSymbolAndAddress(extraCollateralAPY || []),
        extraCollateralPoints: removeSymbolAndAddress(
          extraCollateralPoints ? [extraCollateralPoints] : [],
        ),
      },
    });
  }

  res.set({ "Content-Type": "application/json" });
  res.send(toJSONWithBigint({ data: data, status: "ok" } as Response));
}

export function getGearAPY(req: any, res: any, fetcher: Fetcher) {
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

export function getPoolRewards(req: any, res: any, fetcher: Fetcher) {
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
    const r = toJSONWithBigint(res);
    out.set({ "Content-Type": "application/json" });
    out.send(toJSONWithBigint(r));
    captureException({ file: "endpoints/checkResp", error: r });
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
