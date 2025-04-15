import { captureException } from "@sentry/node";
import type { Address } from "viem";
import { isAddress } from "viem";

import { isSupportedNetwork } from "./core/chains";
import { toJSONWithBigint } from "./core/utils";
import type { ApyDetails, Fetcher, GearAPYDetails } from "./fetcher";
import type { ExternalApy } from "./pools";
import type { PoolPointsInfo } from "./pools/points";
import type { PointsInfo } from "./tokens/points";
import type { ExtraCollateralAPY } from "./tokens/tokenExtraCollateralAPY";
import type { ExtraCollateralPointsInfo } from "./tokens/tokenExtraCollateralPoints";
import type { FarmInfo } from "./tokens/tokenExtraRewards";

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
    points: Array<Omit<PoolPointsInfo, "pool">>;
    externalAPY: Array<Omit<ExternalApy, "pool">>;
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
    | GearAPYDetails;
}

function removeSymbolAndAddress<T extends { address: Address; symbol: string }>(
  l: Array<T>,
): Array<Omit<T, "address" | "symbol">> {
  return l.map(({ symbol, address, ...rest }) => rest);
}

function removePool<T extends { pool: Address }>(
  l: Array<T>,
): Array<Omit<T, "pool">> {
  return l.map(({ pool, ...rest }) => rest);
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
      data: {
        base: fetcher.cache[chainId]?.gear?.base || 0,
        crv: fetcher.cache[chainId]?.gear?.gear || 0,
        gear: fetcher.cache[chainId]?.gear?.crv || 0,

        gearPrice: fetcher.cache[chainId]?.gear?.gearPrice || 0,

        lastUpdated: fetcher.cache[chainId]?.gear?.lastUpdated || 0,
      },
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
  ).reduce<Record<Address, PoolOutputDetails>>((acc, [p, rd]) => {
    const pool = p as Address;
    const cleared = removePool(rd);

    acc[pool] = {
      chainId: chainId,
      pool: pool,

      rewards: {
        points: cleared,
        externalAPY: [],
      },
    };

    return acc;
  }, {});

  Object.entries(fetcher.cache[chainId]?.poolExternalAPYList || {}).forEach(
    ([p, ex]) => {
      const pool = p as Address;
      const cleared = removePool(ex);

      if (ex.length > 0) {
        if (data[pool]) {
          data[pool].rewards.externalAPY.push(...cleared);
        } else {
          data[pool] = {
            chainId: chainId,
            pool: pool,
            rewards: {
              points: [],
              externalAPY: cleared,
            },
          };
        }
      }
    },
  );

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
    console.error(`[SYSTEM] (CHECK RESPONSE): ${r}`);
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
