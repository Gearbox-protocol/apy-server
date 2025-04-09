import { init } from "@sentry/node";
import cors from "cors";
import { config } from "dotenv";
import express, { json } from "express";

import { Fetcher } from "./src/fetcher";

config();

init({
  dsn: "https://068cd79b8537ac37326fd7e917c0df41@o4509052850470912.ingest.us.sentry.io/4509052850733057",

  // Set sampling rate for profiling - this is evaluated only once per SDK.init
  profileSessionSampleRate: 1.0,
  enabled: true,
  normalizeDepth: 10,
});

import {
  checkResp,
  getAll,
  getByChainAndToken,
  getGearAPY,
  getPoolRewards,
  getRewardList,
} from "./src/endpoints";
import { captureException } from "./src/sentry";

const app = express();
const port = process.env.PORT ?? 8000;
app.use(json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: "GET,PUT,POST,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  }),
);

const f = new Fetcher();
void (async function run() {
  await f.loop();
})();

app.get("/api/health", (req, res) => {
  try {
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
    captureException({ file: "/api/health", error: e });
  }
});
app.get("/api/rewards/gear-apy", (req, res) => {
  try {
    void getGearAPY(req, res, f);
  } catch (e) {
    res.sendStatus(500);
    captureException({ file: "/api/rewards/gear-apy", error: e });
  }
});
app.get("/api/rewards/pools/all", (req, res) => {
  try {
    void getPoolRewards(req, res, f);
  } catch (e) {
    res.sendStatus(500);
    captureException({ file: "/api/rewards/pools/all", error: e });
  }
});
app.get("/api/rewards/tokens/all", (req, res) => {
  try {
    void getAll(req, res, f);
  } catch (e) {
    res.sendStatus(500);
    captureException({ file: "/api/rewards/tokens/all", error: e });
  }
});
app.post("/api/rewards/tokens/list", (req, res) => {
  try {
    void getRewardList(req, res, f);
  } catch (e) {
    res.sendStatus(500);
    captureException({ file: "/api/rewards/tokens/list", error: e });
  }
});
app.get("/api/rewards/tokens/:chainId/:tokenAddress", (req, res) => {
  try {
    void getByChainAndToken(req, res, f);
  } catch (e) {
    res.sendStatus(500);
    captureException({
      file: "/api/rewards/tokens/:chainId/:tokenAddress",
      error: e,
    });
  }
});

app.get("/api/rewards/list", (req, res) => {
  checkResp(
    {
      status: "error",
      description: "Method Not Allowed: use POST",
    },
    res,
  );
});

try {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
} catch (e) {
  captureException({ file: "main/app.listen", error: e });
}
