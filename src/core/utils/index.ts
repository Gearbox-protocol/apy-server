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

export const IS_DEV = process.env.NODE_ENV !== "production";

export const LIDO_AUTH_TOKEN = process.env.LIDO_AUTH_TOKEN;
export const RESOLV_AUTH_TOKEN = process.env.RESOLV_AUTH_TOKEN;

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};
