import { AppError } from "../../core/errors";
import { type Handler, respondWithError } from "../../core/server";

export const notFound: Handler = app => async (req, res) => {
  respondWithError({
    app,
    res,
    error: new AppError({
      code: "NOT_FOUND",
      message: `Not found: ${req.originalUrl}`,
    }),
    file: "handlers/notFound",
  });
};
