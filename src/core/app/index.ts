import { Fetcher } from "./fetcher";

export * from "./fetcher";

export interface App {
  state: Fetcher;
}

export function initApp(): App {
  const state = new Fetcher();
  void (async function run() {
    await state.loop();
  })();

  return {
    state,
  };
}
