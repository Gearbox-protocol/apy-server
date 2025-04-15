export function toJSONWithBigint(o: any) {
  const r = JSON.stringify(o, (_, v) =>
    typeof v === "bigint" ? v.toString() : v,
  );

  return r;
}
