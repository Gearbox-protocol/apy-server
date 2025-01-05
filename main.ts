import cors from "cors";
import { config } from "dotenv";
import express, { json } from "express";

import { Fetcher } from "./src/fetcher";
config();

import {
  checkResp,
  getAll,
  getByChainAndToken,
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

app.get("/api/rewards/all/", (req, res) => {
  void getAll(req, res, f);
});
app.get("/api/rewards/:chainId/:tokenAddress", (req, res) => {
  void getByChainAndToken(req, res, f);
});
app.post("/api/rewards/list", (req, res) => {
  void getRewardList(req, res, f);
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
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
