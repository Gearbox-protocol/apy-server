export type GeneralErrorCodes = "NOT_FOUND" | "UNKNOWN_ERROR";

export const generalErrorHttpCode: Record<GeneralErrorCodes, number> = {
  NOT_FOUND: 404,
  UNKNOWN_ERROR: 500,
};
