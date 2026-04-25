import type { AxiosError } from "axios";
import { isAxiosError } from "axios";
import { json_stringify } from "../utils";
import type { GeneralErrorCodes } from "./general";

type AppErrorCodes = GeneralErrorCodes;

const errorStrings: Record<AppErrorCodes, string> = {
  UNKNOWN_ERROR: "Internal server error",
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
  message: string;
  originalError?: TypedError;

  constructor({ code, originalError, message }: AppErrorProps) {
    super();

    this.code = code;
    this.message = message ?? errorStrings[code];
    this.originalError = originalError;
  }

  static isAppError(e: unknown): e is AppError {
    const correctField =
      !!e && typeof e === "object" && "type" in e && e?.type === AppError.type;

    return correctField || e instanceof AppError;
  }

  static getAppError(e: unknown): AppError {
    const wrappedError = AppError.getTypedError(e);
    if (AppError.isAppError(wrappedError)) return wrappedError;
    return new AppError({ code: "UNKNOWN_ERROR", originalError: wrappedError });
  }

  private static getTypedError(value: unknown): TypedError {
    if (typeof value === "object" && value !== null) {
      return value;
    }
    return { message: String(value) };
  }

  static serializeError(err: TypedError, omit?: Record<string | symbol, true>) {
    try {
      if (isAxiosError(err as unknown)) {
        const e = err as AxiosError;
        const cfg = e.config;

        const config = cfg
          ? stripUndefined({
              headers: cfg.headers,
              url: cfg.url,
              withCredentials: cfg.withCredentials,
              xsrfCookieName: cfg.xsrfCookieName,
              xsrfHeaderName: cfg.xsrfHeaderName,
            })
          : undefined;

        const method = cfg?.method;
        const methodLower = method?.toLowerCase();
        const request =
          method !== undefined
            ? stripUndefined({
                method,
                ...(methodLower === "post" ? { body: cfg?.data } : {}),
              })
            : undefined;

        const serialized = stripUndefined({
          config,
          code: e.code,
          isAxiosError: e.isAxiosError,
          message: e.message,
          stack: e.stack,
          request,
        });

        return json_stringify(serialized);
      }

      const allProps = [
        ...Object.getOwnPropertyNames(err),
        ...Object.getOwnPropertySymbols(err),
      ];

      const serializedObj = allProps.reduce<Record<string | symbol, unknown>>(
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

function stripUndefined<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}
