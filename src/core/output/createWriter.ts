import { CACHE_TTL, HISTORICAL_OUT, OUTPUT_JSON, S3_BUCKET } from "../config";
import { FileWriter } from "./FileWriter";
import { S3Writer } from "./S3Writer";
import type { IOutputWriter } from "./types";

export function createWriter(): IOutputWriter {
  if (S3_BUCKET) {
    return new S3Writer(S3_BUCKET, OUTPUT_JSON, HISTORICAL_OUT, CACHE_TTL);
  }
  return new FileWriter(OUTPUT_JSON);
}
