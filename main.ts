import cors from "cors";
import { config } from "dotenv";
import express, { json } from "express";

import { Fetcher } from "./src/fetcher";
config();

import { captureException, init } from "@sentry/node";

init({
  dsn: "https://068cd79b8537ac37326fd7e917c0df41@o4509052850470912.ingest.us.sentry.io/4509052850733057",

  // Set sampling rate for profiling - this is evaluated only once per SDK.init
  profileSessionSampleRate: 1.0,
});

import {
  checkResp,
  getAll,
  getByChainAndToken,
  getGearAPY,
  getPoolRewards,
  getRewardList,
} from "./src/endpoints";

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
  res.sendStatus(200);
});
app.get("/api/rewards/gear-apy", (req, res) => {
  void getGearAPY(req, res, f);
});
app.get("/api/rewards/pools/all", (req, res) => {
  void getPoolRewards(req, res, f);
});
app.get("/api/rewards/tokens/all", (req, res) => {
  void getAll(req, res, f);
});
app.post("/api/rewards/tokens/list", (req, res) => {
  void getRewardList(req, res, f);
});
// !& backwards compatibility
app.get("/api/rewards/all/", (req, res) => {
  void getAll(req, res, f);
});
app.get("/api/rewards/tokens/:chainId/:tokenAddress", (req, res) => {
  void getByChainAndToken(req, res, f);
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
  captureException(e);
}
