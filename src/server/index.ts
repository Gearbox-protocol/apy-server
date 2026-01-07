import cors from "cors";
import express, { json } from "express";

import type { App } from "../core/app";
import { checkHealth } from "./controllers/health";
import { notFound } from "./controllers/not-found";
import initRewardsRouter from "./controllers/rewards";

export interface InitServerProps {
  app: App;
}

export const initServer = ({ app }: InitServerProps) => {
  const server = express();
  server.use(json());
  server.use(
    cors({
      origin: "*",
      credentials: true,
      methods: "GET,PUT,POST,OPTIONS",
      allowedHeaders: "Content-Type,Authorization",
    }),
  );

  server.use("/api/rewards", initRewardsRouter(app));

  server.get("/api/health", checkHealth(app));

  // send 404 for all other routes
  server.use(notFound(app));

  return server;
};
