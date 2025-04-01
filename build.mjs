import * as esbuild from "esbuild";
import { createBuildSettings } from "./settings.mjs";
import { sentryEsbuildPlugin } from "@sentry/esbuild-plugin";
//
var settings = createBuildSettings({ minify: true, sourcemap: "both" });
settings.plugins.push(
  sentryEsbuildPlugin({
    authToken: process.env.SENTRY_AUTH_TOKEN,
    org: "harsh-jain",
    project: "apy-server",
  }),
);
await esbuild.build(settings);
