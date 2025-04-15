import { AppError } from "../../core/errors";
import { type Handler, respondWithError } from "../../core/server";

export const checkHealth: Handler = app => async (__, res) => {
  try {
    res.sendStatus(200);
  } catch (e) {
    respondWithError(app, res, AppError.getAppError(e));
  }
};
