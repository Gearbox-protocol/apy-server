import type { Address } from "viem";

import type { App } from "../../../core/app";
import type { GearAPYDetails } from "../../../core/app/fetcher";
import type {
  PoolOutputDetails,
  TokenOutputDetails,
} from "../../../core/server";
import { removePool, removeSymbolAndAddress } from "../../../core/server";

export type DataResult<T> =
  | { status: "ok"; data: T }
  | { status: "error"; message: string; code?: string };

export function getTokenRewards(
  app: App,
  chainId: number,
): DataResult<TokenOutputDetails[]> {
  try {
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

    return { status: "ok", data: Object.values(data) };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : String(error),
      code: "UNKNOWN_ERROR",
    };
  }
}

export function getPoolRewards(
  app: App,
  chainId: number,
): DataResult<PoolOutputDetails[]> {
  try {
    const data = Object.entries(
      app.state.rewards[chainId]?.poolPointsList || {},
    ).reduce<Record<Address, PoolOutputDetails>>((acc, [p, rd]) => {
      const pool = p as Address;
      const cleared = removePool(rd);

      acc[pool] = {
        chainId: chainId,
        pool: pool,
        rewards: { points: cleared, externalAPY: [], extraAPY: [] },
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
            rewards: { points: [], externalAPY: cleared, extraAPY: [] },
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
            rewards: { points: [], externalAPY: [], extraAPY: cleared },
          };
        }
      }
    });

    return { status: "ok", data: Object.values(data) };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : String(error),
      code: "UNKNOWN_ERROR",
    };
  }
}

export function getGearAPY(app: App): DataResult<GearAPYDetails> {
  try {
    const result: GearAPYDetails = {
      base: app.state.gear?.base || 0,
      crv: app.state.gear?.crv || 0,
      gear: app.state.gear?.gear || 0,
      gearPrice: app.state.gear?.gearPrice || 0,
      lastUpdated: app.state.gear?.lastUpdated || "0",
    };

    return { status: "ok", data: result };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : String(error),
      code: "UNKNOWN_ERROR",
    };
  }
}
