import { config } from "dotenv";

import { initApp } from "./src/core/app";
import { captureException, initSentry } from "./src/core/sentry";
import { IS_DEV } from "./src/core/utils";
import { initServer } from "./src/server";

config();

if (!IS_DEV) {
  initSentry();
}

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
