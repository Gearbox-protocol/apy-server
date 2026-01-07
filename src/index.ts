import { Fetcher, initApp } from "./core/app";
import { IS_DEV, ONE_SHOT } from "./core/config";
import { createWriter } from "./core/output";
import { captureException, initSentry } from "./core/sentry";
import { initServer } from "./server";

if (!IS_DEV) {
  initSentry();
}

async function main() {
  try {
    // Check for one-shot mode
    if (ONE_SHOT) {
      const fetcher = new Fetcher();
      const outputWriter = createWriter();
      await fetcher.oneShot(outputWriter);
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
    captureException({ file: "main/app.listen", error: e as Error });
    process.exit(1);
  }
}

void main();
