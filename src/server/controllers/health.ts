import { AppError } from "../../core/errors";
import { type Handler, respondWithError } from "../../core/server";

export const checkHealth: Handler = app => async (req, res) => {
  try {
    res.sendStatus(200);
  } catch (e) {
    respondWithError({
      app,
      req,
      res,
      error: AppError.getAppError(e),
      file: "handlers/checkHealth",
    });
  }
};
