import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";

import { Fetcher } from "./fetcher";

export * from "./fetcher";

export interface App {
  state: Fetcher;
}

export function initApp(): App {
  console.log("[SYSTEM]: Starting app");
  const state = new Fetcher();
  void (async function run() {
    await state.loop();
  })();

  return {
    state,
  };
}

const instance = Axios.create();
export const cachedAxios = setupCache(instance, {
  location: "server",
  interpretHeader: false,
  ttl: 3 * 60 * 1000,
});
