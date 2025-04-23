import * as Sentry from "@sentry/node";
import { init } from "@sentry/node";
import type { Request } from "express";

import { AppError } from "../errors";
import { json_stringify } from "../utils";

interface CaptureExceptionProps {
  file: string;
  error: Error;

  req?: Request;
}

const APP_NAME_TAG = "app.name";
const APP_PATH_TAG = "app.path";
const APP_NAME = "gearbox_apy_server";

export function captureException({
  file,
  req,
  error: e,
}: CaptureExceptionProps) {
  const error = AppError.getAppError(e);

  Sentry.withScope(scope => {
    scope.setTag(APP_NAME_TAG, APP_NAME);
    scope.setTag(APP_PATH_TAG, file);

    scope.addAttachment({
      data: AppError.serializeError(error.originalError || error),
      filename: "original_error.json",
      contentType: "application/json",
    });

    if (req) {
      scope.addAttachment({
        data: getRequestData(req),
        filename: "request.json",
        contentType: "application/json",
      });
    }

    Sentry.captureException(error);
  });
}

function getRequestData(req: Request) {
  return json_stringify({
    protocol: req.protocol,
    hostname: req.hostname,
    baseUrl: req.baseUrl,
    path: req.path,
    params: req.params,
    query: req.query,
    url: req.url,
    originalUrl: req.originalUrl,

    httpVersion: req.httpVersion,
    method: req.method,
    body: req.body,

    headers: req.headers,

    ip: req.ip,

    route: req.route,
  });
}

export const initSentry = () => {
  console.log("[SYSTEM]: Starting sentry");

  return init({
    dsn: "https://068cd79b8537ac37326fd7e917c0df41@o4509052850470912.ingest.us.sentry.io/4509052850733057",

    // Set sampling rate for profiling - this is evaluated only once per SDK.init
    profileSessionSampleRate: 1.0,
    enabled: true,
    normalizeDepth: 10,
  });
};
