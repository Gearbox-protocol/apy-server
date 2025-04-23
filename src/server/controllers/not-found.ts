import { AppError } from "../../core/errors";
import { type Handler, respondWithError } from "../../core/server";

const PATHS_TO_IGNORE: Record<string, boolean> = {
  "/robots.txt": true,
  "/": true,
};

export const notFound: Handler = app => async (req, res) => {
  respondWithError({
    app,
    req,
    res,
    error: new AppError({
      code: "NOT_FOUND",
    }),
    file: "handlers/notFound",
    reportSentry: !PATHS_TO_IGNORE[req.url],
  });
};
