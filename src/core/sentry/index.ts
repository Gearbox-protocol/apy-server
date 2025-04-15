import * as Sentry from "@sentry/node";

import { AppError } from "../errors";

interface SentryError {
  file: string;
  error: unknown;
}

const APP_NAME_TAG = "app.name";
const APP_PATH_TAG = "app.path";
const APP_NAME = "gearbox_apy_server";

export function captureException({ file, error: e }: SentryError) {
  const error = AppError.getTypedError(e);

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
