import type { Address } from "viem";

import type {
  PoolOutputDetails,
  Response,
  TokenOutputDetails,
} from "./core/response";
import { removePool, removeSymbolAndAddress } from "./core/response";
import { toJSONWithBigint } from "./core/utils";
import { checkChainId, checkResp } from "./core/validation";
import type { Fetcher } from "./fetcher";

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

  const response: Response = { data: Object.values(data), status: "ok" };

  res.set({ "Content-Type": "application/json" });
  res.send(toJSONWithBigint(response));
}

export function getGearAPY(req: any, res: any, fetcher: Fetcher) {
  const [isChainIdValid, chainId] = checkChainId(req.query.chain_id);
  if (!checkResp(isChainIdValid, res)) {
    return;
  }

  const response: Response = {
    data: {
      base: fetcher.cache[chainId]?.gear?.base || 0,
      crv: fetcher.cache[chainId]?.gear?.gear || 0,
      gear: fetcher.cache[chainId]?.gear?.crv || 0,

      gearPrice: fetcher.cache[chainId]?.gear?.gearPrice || 0,

      lastUpdated: fetcher.cache[chainId]?.gear?.lastUpdated || "0",
    },
    status: "ok",
  };

  res.set({ "Content-Type": "application/json" });
  res.send(toJSONWithBigint(response));
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

  const response: Response = {
    data: Object.values(data),
    status: "ok",
  };

  res.set({ "Content-Type": "application/json" });
  res.send(toJSONWithBigint(response));
}
