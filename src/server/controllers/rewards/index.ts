import { Router } from "express";

import type { App } from "../../../core/app";
import {
  getGearAPYHandler,
  getPoolRewardsHandler,
  getTokenRewardsHandler,
} from "./handlers";

const initRewardsRouter = (app: App) => {
  const router = Router();

  router.route("/gear-apy").get(getGearAPYHandler(app));
  router.route("/pools/all").get(getPoolRewardsHandler(app));
  router.route("/tokens/all").get(getTokenRewardsHandler(app));

  return router;
};

export default initRewardsRouter;
