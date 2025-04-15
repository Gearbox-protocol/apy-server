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

export const getTokenRewards: Handler = app => async (req, res) => {
  try {
    const { chainId } = validateReq({ chainId: req.query.chain_id });

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

    Object.entries(
      app.cache[chainId]?.tokenExtraCollateralPoints || {},
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
    respondWithError(app, res, AppError.getTypedError(e));
  }
};

export const getGearAPY: Handler = app => async (req, res) => {
  try {
    const { chainId } = validateReq({ chainId: req.query.chain_id });

    const response: ResponseData = {
      data: {
        base: app.cache[chainId]?.gear?.base || 0,
        crv: app.cache[chainId]?.gear?.gear || 0,
        gear: app.cache[chainId]?.gear?.crv || 0,

        gearPrice: app.cache[chainId]?.gear?.gearPrice || 0,

        lastUpdated: app.cache[chainId]?.gear?.lastUpdated || "0",
      },
      status: "ok",
    };

    respondWithJson(app, res, response);
  } catch (e) {
    respondWithError(app, res, AppError.getTypedError(e));
  }
};

export const getPoolRewards: Handler = app => async (req, res) => {
  try {
    const { chainId } = validateReq({ chainId: req.query.chain_id });

    const data = Object.entries(
      app.cache[chainId]?.poolPointsList || {},
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

    const response: ResponseData = {
      data: Object.values(data),
      status: "ok",
    };

    respondWithJson(app, res, response);
  } catch (e) {
    respondWithError(app, res, AppError.getTypedError(e));
  }
};
