import { setTimeout } from "node:timers/promises";

export const json_stringify = (
  o: unknown,
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

export type PartialRecord<K extends string | number | symbol, V> = Partial<
  Record<K, V>
>;

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
