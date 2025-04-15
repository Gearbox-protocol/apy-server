import { Router } from "express";

import type { App } from "../../../core/app";
import { getGearAPY, getPoolRewards, getTokenRewards } from "./handlers";

const initRewardsRouter = (app: App) => {
  const router = Router();

  router.route("/gear-apy").get(getGearAPY(app));
  router.route("/pools/all").get(getPoolRewards(app));
  router.route("/tokens/all").get(getTokenRewards(app));

  return router;
};

export default initRewardsRouter;
