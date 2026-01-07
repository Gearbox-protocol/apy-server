import { AppError } from "../../../core/errors";
import type { Handler, ResponseData } from "../../../core/server";
import { respondWithError, respondWithJson } from "../../../core/server";
import { validateReq } from "../../../core/validation";
import { getGearAPY, getPoolRewards, getTokenRewards } from "./data";

const PATHS_TO_IGNORE: Record<string, boolean> = {
  "/api/rewards/pools/all": true,
  "/api/rewards/tokens/all": true,
};

export const getTokenRewardsHandler: Handler = app => async (req, res) => {
  try {
    const { chainId } = validateReq({ chainId: req.query.chain_id });

    const dataResult = getTokenRewards(app, chainId);

    if (dataResult.status === "error") {
      throw new AppError({
        code: (dataResult.code as any) || "UNKNOWN_ERROR",
        message: dataResult.message || "Failed to get token rewards",
      });
    }

    const response: ResponseData = { data: dataResult.data, status: "ok" };

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

export const getGearAPYHandler: Handler = app => async (req, res) => {
  try {
    const dataResult = getGearAPY(app);

    if (dataResult.status === "error") {
      throw new AppError({
        code: (dataResult.code as any) || "UNKNOWN_ERROR",
        message: dataResult.message || "Failed to get gear APY",
      });
    }

    const response: ResponseData = { data: dataResult.data, status: "ok" };

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

export const getPoolRewardsHandler: Handler = app => async (req, res) => {
  try {
    const { chainId } = validateReq({ chainId: req.query.chain_id });

    const dataResult = getPoolRewards(app, chainId);

    if (dataResult.status === "error") {
      throw new AppError({
        code: (dataResult.code as any) || "UNKNOWN_ERROR",
        message: dataResult.message || "Failed to get pool rewards",
      });
    }

    const response: ResponseData = { data: dataResult.data, status: "ok" };

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
