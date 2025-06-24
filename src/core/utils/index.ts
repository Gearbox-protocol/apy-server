export const json_stringify = (o: any, space?: number) => {
  const r = JSON.stringify(
    o,
    (_, v) => (typeof v === "bigint" ? v.toString() : v),
    space,
  );

  return r;
};

export const IS_DEV = process.env.NODE_ENV !== "production";

export const LIDO_AUTH_TOKEN = process.env.LIDO_AUTH_TOKEN;
