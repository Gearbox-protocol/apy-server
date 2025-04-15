import { isSupportedNetwork } from "../chains";
import { AppError } from "../errors";
import type { NotValidated, Validated } from "./types";

type ChainId = number;

const validateChainId = (rawChainId: unknown): ChainId => {
  const chainId = Number(rawChainId ?? "empty");
  if (isNaN(chainId)) {
    throw new AppError({
      code: "WRONG_FORMAT",
      message: "Incorrect chain_id - must be integer",
    });
  }

  if (!isSupportedNetwork(chainId)) {
    throw new AppError({
      code: "WRONG_FORMAT",
      message: `Unknown chain_id = ${chainId}`,
    });
  }

  return chainId;
};

const validators = {
  chainId: validateChainId,
} as const;

interface ReqRes {
  chainId: ChainId;
}

type ReqParams = NotValidated<ReqRes>;

export const validateReq = <T extends ReqParams>(
  params: T,
): Validated<T, ReqRes> => {
  const paramsEntries = Object.entries(params) as Array<
    [keyof Validated<T, ReqRes>, any]
  >;

  return paramsEntries.reduce(
    (sum, [key, value]) => {
      const validator = validators[key];
      if (!validator)
        throw new AppError({
          code: "WRONG_FORMAT",
          message: `Can't validate ${key}`,
        });

      const validatedValue = validator(value);

      return { ...sum, [key]: validatedValue };
    },
    {} as Validated<T, ReqRes>,
  );
};
