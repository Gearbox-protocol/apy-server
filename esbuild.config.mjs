import { sentryEsbuildPlugin } from "@sentry/esbuild-plugin";
import { build } from "esbuild";

const { SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT } = process.env;

build({
  entryPoints: ["src/index.ts"],
  outdir: "build",
  bundle: true,
  platform: "node",
  format: "esm",
  outExtension: { ".js": ".mjs" },
  target: ["node24"],
  sourcemap: "external",
  banner: {
    js: `
          import { createRequire } from 'module';
          import { fileURLToPath } from 'url';

          const require = createRequire(import.meta.url);
        `,
  },
  plugins:
    SENTRY_AUTH_TOKEN && SENTRY_ORG
      ? [
          sentryEsbuildPlugin({
            authToken: SENTRY_AUTH_TOKEN,
            org: SENTRY_ORG,
            project: SENTRY_PROJECT || "apy-server",
          }),
        ]
      : undefined,
}).catch(e => {
  console.error(e);
  process.exit(1);
});
