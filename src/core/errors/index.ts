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
  originalError?: TypedError;
}

export class AppError extends Error {
  static type = "AppError" as const;
  type = AppError.type;

  code: AppErrorCodes;
  httpCode: number;
  message: string;
  originalError?: TypedError;

  constructor({ code, originalError, message }: AppErrorProps) {
    super();

    this.code = code;
    this.httpCode = appErrorHttpCodes[code];
    this.message = message ?? errorStrings[code];
    this.originalError = originalError;
  }

  static isAppError(e: unknown): e is AppError {
    const correctField =
      !!e && typeof e === "object" && "type" in e && e?.type === AppError.type;

    return correctField || e instanceof AppError;
  }

  static getAppError(e: any): AppError {
    const wrappedError = AppError.getTypedError(e);
    if (AppError.isAppError(wrappedError)) return wrappedError;
    return new AppError({ code: "UNKNOWN_ERROR", originalError: wrappedError });
  }

  private static getTypedError(value: any): TypedError {
    if (typeof value === "object" && value !== null) {
      return value;
    }
    return { message: String(value) };
  }

  static serializeError(err: TypedError, omit?: Record<string | symbol, true>) {
    try {
      const allProps = [
        ...Object.getOwnPropertyNames(err),
        ...Object.getOwnPropertySymbols(err),
      ];

      const serializedObj = allProps.reduce<Record<string | symbol, any>>(
        (acc, key) => {
          if (!omit?.[key]) {
            const value = err[key as keyof TypedError];
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

interface BaseError {
  name?: string;
  message?: string;
  stack?: string;
  code?: string | number;
  type?: string;
  event?: string;
  reason?: string;
  action?: string;
}

interface TypedError {
  name?: string;
  message?: string;
  shortMessage?: string;
  stack?: string;
  code?: string | number;
  type?: string;
  event?: string;
  reason?: string;
  action?: string;

  error?: BaseError;
  data?: {
    originalError: BaseError;
  } & BaseError;
  info?: {
    error?: BaseError;
  };
}
