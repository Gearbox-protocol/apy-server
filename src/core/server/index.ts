import type { RequestHandler, Response } from "express";
import type { Address } from "viem";

import type { ExternalApy } from "../../pools";
import type { PoolExtraApy } from "../../pools/extraAPY/constants";
import type { PoolPointsInfo } from "../../pools/points";
import type { PointsInfo } from "../../tokens/points";
import type { ExtraCollateralAPY } from "../../tokens/tokenExtraCollateralAPY";
import type { ExtraCollateralPointsInfo } from "../../tokens/tokenExtraCollateralPoints";
import type { FarmInfo } from "../../tokens/tokenExtraRewards";
import type { App } from "../app";
import type { ApyDetails, GearAPYDetails } from "../app/fetcher";
import { AppError } from "../errors";
import { captureException } from "../sentry";
import { json_stringify } from "../utils";

export type Handler = (app: App) => RequestHandler;

export interface ResponseData {
  status: "error" | "ok";
  description?: string;
  data?:
    | Array<TokenOutputDetails>
    | TokenOutputDetails
    | Array<PoolOutputDetails>
    | PoolOutputDetails
    | GearAPYDetails;
}

export interface TokenOutputDetails {
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

export interface PoolOutputDetails {
  chainId: number;
  pool: Address;

  rewards: {
    points: Array<Omit<PoolPointsInfo, "pool">>;
    externalAPY: Array<Omit<ExternalApy, "pool">>;
    extraAPY: Array<Omit<PoolExtraApy, "pool">>;
  };
}

export function removeSymbolAndAddress<
  T extends { address: Address; symbol: string },
>(l: Array<T>): Array<Omit<T, "address" | "symbol">> {
  return l.map(({ symbol, address, ...rest }) => rest);
}

export function removePool<T extends { pool: Address }>(
  l: Array<T>,
): Array<Omit<T, "pool">> {
  return l.map(({ pool, ...rest }) => rest);
}

interface RespondWithErrorProps {
  app: App;
  res: Response;
  error: AppError;

  file: string;
  reportSentry?: boolean;
}

export const respondWithError = ({
  res,
  error: e,
  reportSentry = true,
}: RespondWithErrorProps) => {
  res.status(e.httpCode);
  res.set({ "Content-Type": "application/json" });
  res.send({ message: e.message, code: e.code });

  if (reportSentry) captureException({ file: "endpoints/checkResp", error: e });
  console.error(`[SYSTEM] (CHECK RESPONSE): ${AppError.serializeError(e)}`);
};

export const respondWithJson = (_: App, res: Response, data: ResponseData) => {
  res.set({ "Content-Type": "application/json" });
  res.send(json_stringify(data));
};
