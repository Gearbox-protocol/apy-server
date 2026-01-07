import "dotenv/config";

import { Fetcher, initApp } from "./src/core/app";
import { IS_DEV, ONE_SHOT, OUTPUT_JSON } from "./src/core/config";
import { FileWriter } from "./src/core/output/fileWriter";
import { captureException, initSentry } from "./src/core/sentry";
import { initServer } from "./src/server";

if (!IS_DEV) {
  initSentry();
}

async function main() {
  try {
    // Check for one-shot mode
    if (ONE_SHOT) {
      const fetcher = new Fetcher();
      const outputWriter = new FileWriter(OUTPUT_JSON);

      await fetcher.oneShot(outputWriter);
      console.log(`[SYSTEM]: Output written to ${OUTPUT_JSON}`);
      process.exit(0);
    }

    // Normal server mode
    const app = initApp();
    const server = initServer({ app });
    const port = process.env.PORT ?? 8000;
    server.listen(port, () => {
      console.log(`[SYSTEM]: Server is running at http://localhost:${port}`);
    });
  } catch (e) {
    console.error("[SYSTEM]: Error in main:", e);
    captureException({ file: "main/app.listen", error: e });
    process.exit(1);
  }
}

void main();
