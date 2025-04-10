import * as Sentry from "@sentry/node";

interface SentryError {
  file: string;
  error: unknown;
}

export const APP_NAME_TAG = "app.name";
export const APP_PATH_TAG = "app.path";
export const ERR_DESCRIPTION_TAG = "err.description";
export const APP_NAME = "gearbox_apy_server";

export function captureException({ file, error: e }: SentryError) {
  Sentry.withScope(scope => {
    scope.setTag(APP_NAME_TAG, APP_NAME);
    scope.setTag(APP_PATH_TAG, file);

    Sentry.captureException(e);
  });
}
