import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { json_stringify } from "../../core/utils";
import type { IOutputWriter } from "./types";

export class S3Writer implements IOutputWriter {
  readonly #s3Client: S3Client;
  readonly #bucket: string;
  readonly #key: string;
  readonly #cacheMaxAge?: number;

  constructor(bucket: string, key: string, cacheTtl?: number) {
    this.#s3Client = new S3Client({});
    this.#bucket = bucket;
    this.#key = key;
    this.#cacheMaxAge = cacheTtl;
  }

  async write(data: unknown): Promise<void> {
    try {
      const json = json_stringify(data, 2);
      const expiresDate = this.#cacheMaxAge
        ? new Date(Date.now() + this.#cacheMaxAge * 1000)
        : undefined;
      const cacheControl = this.#cacheMaxAge
        ? `public, max-age=${this.#cacheMaxAge}`
        : undefined;

      const command = new PutObjectCommand({
        Bucket: this.#bucket,
        Key: this.#key,
        Body: json,
        ContentType: "application/json",
        CacheControl: cacheControl,
        Expires: expiresDate,
      });

      await this.#s3Client.send(command);
      console.log(
        `[SYSTEM]: Successfully wrote output to s3://${this.#bucket}/${this.#key} with cache max-age=${this.#cacheMaxAge}s`,
      );
    } catch (error) {
      console.error(
        `[SYSTEM]: Failed to write output to s3://${this.#bucket}/${this.#key}:`,
        error,
      );
      throw error;
    }
  }
}
