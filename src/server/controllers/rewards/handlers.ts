import type { Address } from "viem";

import type {
  Handler,
  PoolOutputDetails,
  Response,
  TokenOutputDetails,
} from "../../../core/server";
import { removePool, removeSymbolAndAddress } from "../../../core/server";
import { toJSONWithBigint } from "../../../core/utils";
import { checkChainId, checkResp } from "../../../core/validation";

export const getTokenRewards: Handler = app => async (req, res) => {
  const [isChainIdValid, chainId] = checkChainId(req.query.chain_id);
  if (!checkResp(isChainIdValid, res)) {
    return;
  }

  const data = Object.entries(app.cache[chainId]?.tokenApyList || {}).reduce<
    Record<Address, TokenOutputDetails>
  >((acc, [t, a]) => {
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

  Object.entries(app.cache[chainId]?.tokenPointsList || {}).forEach(
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

  Object.entries(app.cache[chainId]?.tokenExtraRewards || {}).forEach(
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

  Object.entries(app.cache[chainId]?.tokenExtraCollateralAPY || {}).forEach(
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

  Object.entries(app.cache[chainId]?.tokenExtraCollateralPoints || {}).forEach(
    ([t, p]) => {
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
    },
  );

  const response: Response = { data: Object.values(data), status: "ok" };

  res.set({ "Content-Type": "application/json" });
  res.send(toJSONWithBigint(response));
};

export const getGearAPY: Handler = app => async (req, res) => {
  const [isChainIdValid, chainId] = checkChainId(req.query.chain_id);
  if (!checkResp(isChainIdValid, res)) {
    return;
  }

  const response: Response = {
    data: {
      base: app.cache[chainId]?.gear?.base || 0,
      crv: app.cache[chainId]?.gear?.gear || 0,
      gear: app.cache[chainId]?.gear?.crv || 0,

      gearPrice: app.cache[chainId]?.gear?.gearPrice || 0,

      lastUpdated: app.cache[chainId]?.gear?.lastUpdated || "0",
    },
    status: "ok",
  };

  res.set({ "Content-Type": "application/json" });
  res.send(toJSONWithBigint(response));
};

export const getPoolRewards: Handler = app => async (req, res) => {
  const [isChainIdValid, chainId] = checkChainId(req.query.chain_id);
  if (!checkResp(isChainIdValid, res)) {
    return;
  }

  const data = Object.entries(app.cache[chainId]?.poolPointsList || {}).reduce<
    Record<Address, PoolOutputDetails>
  >((acc, [p, rd]) => {
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

  Object.entries(app.cache[chainId]?.poolExternalAPYList || {}).forEach(
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
};
