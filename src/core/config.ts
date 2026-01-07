export const IS_DEV = process.env.NODE_ENV !== "production";

export const LIDO_AUTH_TOKEN = process.env.LIDO_AUTH_TOKEN;
export const RESOLV_AUTH_TOKEN = process.env.RESOLV_AUTH_TOKEN;

export const ONE_SHOT = process.env.ONE_SHOT === "true";
export const OUTPUT_JSON = process.env.OUTPUT_JSON || "output.json";

export const SENTRY_DSN = process.env.SENTRY_DSN;

export const S3_BUCKET = process.env.S3_BUCKET;
/**
 * Cache TTL in seconds
 */
export const CACHE_TTL = process.env.CACHE_TTL
  ? parseInt(process.env.CACHE_TTL, 10)
  : undefined;

/**
 * One-shot mode timeout in seconds
 */
export const ONE_SHOT_TIMEOUT = process.env.ONE_SHOT_TIMEOUT
  ? parseInt(process.env.ONE_SHOT_TIMEOUT, 10)
  : 0;
