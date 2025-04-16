import { AppError } from "../../core/errors";
import { type Handler, respondWithError } from "../../core/server";

export const notFound: Handler = app => async (req, res) => {
  respondWithError({
    app,
    req,
    res,
    error: new AppError({
      code: "NOT_FOUND",
    }),
    file: "handlers/notFound",
  });
};
