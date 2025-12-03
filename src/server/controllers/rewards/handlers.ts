import type { Address } from "viem";

import { AppError } from "../../../core/errors";
import type {
  Handler,
  PoolOutputDetails,
  ResponseData,
  TokenOutputDetails,
} from "../../../core/server";
import {
  removePool,
  removeSymbolAndAddress,
  respondWithError,
  respondWithJson,
} from "../../../core/server";
import { validateReq } from "../../../core/validation";

const PATHS_TO_IGNORE: Record<string, boolean> = {
  "/api/rewards/pools/all": true,
  "/api/rewards/tokens/all": true,
};

export const getTokenRewards: Handler = app => async (req, res) => {
  try {
    const { chainId } = validateReq({ chainId: req.query.chain_id });

    const data = Object.entries(
      app.state.rewards[chainId]?.tokenApyList || {},
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

    Object.entries(app.state.rewards[chainId]?.tokenPointsList || {}).forEach(
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

    Object.entries(app.state.rewards[chainId]?.tokenExtraRewards || {}).forEach(
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

    Object.entries(
      app.state.rewards[chainId]?.tokenExtraCollateralAPY || {},
    ).forEach(([t, ex]) => {
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
    });

    Object.entries(
      app.state.rewards[chainId]?.tokenExtraCollateralPoints || {},
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

    const response: ResponseData = { data: Object.values(data), status: "ok" };

    respondWithJson(app, res, response);
  } catch (e) {
    const error = AppError.getAppError(e);
    const notReport =
      !!PATHS_TO_IGNORE[req.originalUrl] && req.query.chain_id === undefined;

    respondWithError({
      app,
      req,
      res,
      error,
      file: "rewards/handlers/getTokenRewards",
      reportSentry: !notReport,
    });
  }
};

export const getGearAPY: Handler = app => async (req, res) => {
  try {
    const response: ResponseData = {
      data: {
        base: app.state.gear?.base || 0,
        crv: app.state.gear?.crv || 0,
        gear: app.state.gear?.gear || 0,

        gearPrice: app.state.gear?.gearPrice || 0,

        lastUpdated: app.state.gear?.lastUpdated || "0",
      },
      test: true,
      status: "ok",
    } as any;

    respondWithJson(app, res, response);
  } catch (e) {
    const error = AppError.getAppError(e);

    respondWithError({
      app,
      req,
      res,
      error,
      file: "rewards/handlers/getGearAPY",
    });
  }
};

export const getPoolRewards: Handler = app => async (req, res) => {
  try {
    const { chainId } = validateReq({ chainId: req.query.chain_id });

    const data = Object.entries(
      app.state.rewards[chainId]?.poolPointsList || {},
    ).reduce<Record<Address, PoolOutputDetails>>((acc, [p, rd]) => {
      const pool = p as Address;
      const cleared = removePool(rd);

      acc[pool] = {
        chainId: chainId,
        pool: pool,

        rewards: {
          points: cleared,
          externalAPY: [],
          extraAPY: [],
        },
      };

      return acc;
    }, {});

    Object.entries(
      app.state.rewards[chainId]?.poolExternalAPYList || {},
    ).forEach(([p, ex]) => {
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
              extraAPY: [],
            },
          };
        }
      }
    });

    Object.entries(app.state.poolExtraAPY[chainId] || {}).forEach(([p, ex]) => {
      const pool = p as Address;
      const cleared = ex;

      if (ex.length > 0) {
        if (data[pool]) {
          data[pool].rewards.extraAPY.push(...cleared);
        } else {
          data[pool] = {
            chainId: chainId,
            pool: pool,
            rewards: {
              points: [],
              externalAPY: [],
              extraAPY: cleared,
            },
          };
        }
      }
    });

    const response: ResponseData = {
      data: Object.values(data),
      status: "ok",
    };

    respondWithJson(app, res, response);
  } catch (e) {
    const error = AppError.getAppError(e);
    const notReport =
      !!PATHS_TO_IGNORE[req.originalUrl] && req.query.chain_id === undefined;

    respondWithError({
      app,
      req,
      res,
      error,
      file: "rewards/handlers/getPoolRewards",
      reportSentry: !notReport,
    });
  }
};
