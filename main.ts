import { init } from "@sentry/node";
import { config } from "dotenv";

import { initApp } from "./src/core/app";
import { captureException } from "./src/core/sentry";
import { initServer } from "./src/server";

config();

init({
  dsn: "https://068cd79b8537ac37326fd7e917c0df41@o4509052850470912.ingest.us.sentry.io/4509052850733057",

  // Set sampling rate for profiling - this is evaluated only once per SDK.init
  profileSessionSampleRate: 1.0,
  enabled: true,
  normalizeDepth: 10,
});

function main() {
  try {
    const app = initApp();

    const server = initServer({ app });
    const port = process.env.PORT ?? 8000;
    server.listen(port, () => {
      console.log(`[SYSTEM]: Server is running at http://localhost:${port}`);
    });
  } catch (e) {
    captureException({ file: "main/app.listen", error: e });
  }
}

void main();
