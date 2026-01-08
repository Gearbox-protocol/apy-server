import { Fetcher } from "./core/app";
import { IS_DEV } from "./core/config";
import { createWriter } from "./core/output";
import { captureException, initSentry } from "./core/sentry";

if (!IS_DEV) {
  initSentry();
}

async function main() {
  try {
    const fetcher = new Fetcher();
    const outputWriter = createWriter();
    const result = await fetcher.run();
    await outputWriter.write(result);
    process.exit(0);
  } catch (e) {
    console.error("[SYSTEM]: Error in main:", e);
    captureException({ file: "main", error: e as Error });
    process.exit(1);
  }
}

void main();
