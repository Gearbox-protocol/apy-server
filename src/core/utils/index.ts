import { setTimeout } from "node:timers/promises";

export const json_stringify = (
  o: any,
  space?: number,
  allowDuplicates = false,
) => {
  const duplicates = new Set();

  const r = JSON.stringify(
    o,
    (k, v) => {
      if (typeof v === "object" && v !== null && !allowDuplicates) {
        if (duplicates.has(v)) {
          return `[Duplicate of: ${k}]`;
        }
        duplicates.add(v);
        return v;
      } else if (typeof v === "bigint") {
        return v.toString();
      } else {
        return v;
      }
    },
    space,
  );

  duplicates.clear();
  return r;
};

export type PartialRecord<K extends keyof any, T> = { [P in K]?: T };

export async function timeout(ms: number): Promise<never> {
  await setTimeout(ms);
  throw new Error("The operation was timed out");
}

export async function withTimeout<T>(
  run: () => Promise<T>,
  ms: number,
): Promise<T> {
  return Promise.race([run(), timeout(ms)]);
}
