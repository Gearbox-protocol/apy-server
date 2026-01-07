import { CACHE_TTL, OUTPUT_JSON, S3_BUCKET } from "../config";
import { FileWriter } from "./FileWriter";
import { S3Writer } from "./S3Writer";
import type { IOutputWriter } from "./types";

export function createWriter(): IOutputWriter {
  if (S3_BUCKET) {
    return new S3Writer(S3_BUCKET, OUTPUT_JSON, CACHE_TTL);
  }
  return new FileWriter(OUTPUT_JSON);
}
