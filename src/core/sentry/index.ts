import * as Sentry from "@sentry/node";
import { init } from "@sentry/node";
import { SENTRY_DSN } from "../config";
import { AppError } from "../errors";

interface CaptureExceptionProps {
  file: string;
  error: Error;
}

const APP_NAME_TAG = "app.name";
const APP_PATH_TAG = "app.path";
const APP_NAME = "gearbox_apy_server";

export function captureException({ file, error: e }: CaptureExceptionProps) {
  const error = AppError.getAppError(e);

  Sentry.withScope(scope => {
    scope.setTag(APP_NAME_TAG, APP_NAME);
    scope.setTag(APP_PATH_TAG, file);

    scope.addAttachment({
      data: AppError.serializeError(error.originalError || error),
      filename: "original_error.json",
      contentType: "application/json",
    });

    Sentry.captureException(error);
  });
}

export const initSentry = () => {
  if (!SENTRY_DSN) {
    console.warn("[SYSTEM]: sentry dsn is not set");
    return;
  }

  console.log("[SYSTEM]: Starting sentry");
  return init({
    dsn: SENTRY_DSN,

    // Set sampling rate for profiling - this is evaluated only once per SDK.init
    profileSessionSampleRate: 1.0,
    enabled: true,
    normalizeDepth: 10,
  });
};
