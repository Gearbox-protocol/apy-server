export const json_stringify = (o: any, space?: number) => {
  const r = JSON.stringify(
    o,
    (_, v) => (typeof v === "bigint" ? v.toString() : v),
    space,
  );

  return r;
};
