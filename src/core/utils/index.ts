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
