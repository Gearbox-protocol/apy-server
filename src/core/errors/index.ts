import { json_stringify } from "../utils";
import type { GeneralErrorCodes } from "./general";
import { generalErrorHttpCode } from "./general";
import type { ValidationErrorCodes } from "./validation";
import { validationErrorHttpCodes } from "./validation";

type AppErrorCodes = GeneralErrorCodes | ValidationErrorCodes;

const errorStrings: Record<AppErrorCodes, string> = {
  NOT_FOUND: "Not found",
  UNKNOWN_ERROR: "Internal server error",
  WRONG_FORMAT: "Wrong request format",
};

const appErrorHttpCodes = {
  ...generalErrorHttpCode,
  ...validationErrorHttpCodes,
};

interface AppErrorProps {
  code: AppErrorCodes;
  message?: string;
  originalError?: Error;
}

export class AppError extends Error {
  static type = "AppError" as const;
  type = AppError.type;

  code: AppErrorCodes;
  httpCode: number;
  message: string;
  originalError?: Error;

  constructor({ code, originalError, message }: AppErrorProps) {
    super();

    this.code = code;
    this.httpCode = appErrorHttpCodes[code];
    this.message = message ?? errorStrings[code];
    this.originalError = originalError;
  }

  static isAppError(e: unknown): e is AppError {
    const correctField =
      !!e && typeof e === "object" && "type" in e && e?.type === this.type;

    return correctField || e instanceof AppError;
  }

  static getTypedError(e: any): AppError {
    if (AppError.isAppError(e)) return e;
    return new AppError({ code: "UNKNOWN_ERROR", originalError: e });
  }

  static serializeError(err: Error, omit?: Record<string | symbol, true>) {
    try {
      const allProps = [
        ...Object.getOwnPropertyNames(err),
        ...Object.getOwnPropertySymbols(err),
      ];

      const serializedObj = allProps.reduce<Record<string | symbol, any>>(
        (acc, key) => {
          if (!omit?.[key]) {
            const value = err[key as keyof Error];
            acc[key] = value;
          }

          return acc;
        },
        {},
      );

      const r = json_stringify(serializedObj);

      return r;
    } catch (error) {
      return json_stringify({
        reason: "Can't serialize object",
        message: { error },
      });
    }
  }
}
