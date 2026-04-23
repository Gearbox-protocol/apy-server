import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { json_stringify } from "../../core/utils";
import type { IOutputWriter } from "./types";

export class S3Writer implements IOutputWriter {
  readonly #s3Client: S3Client;
  readonly #bucket: string;
  readonly #key: string;
  readonly #cacheMaxAge?: number;
  readonly #historicalPrefix?: string;

  constructor(
    bucket: string,
    key: string,
    historicalPrefix?: string,
    cacheTtl?: number,
  ) {
    this.#s3Client = new S3Client({});
    this.#bucket = bucket;
    this.#key = key;
    this.#cacheMaxAge = cacheTtl;
    this.#historicalPrefix = historicalPrefix;
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

      if (this.#historicalPrefix) {
        const timestamp = Math.floor(Date.now() / 1000);
        const historicalKey = `${this.#historicalPrefix}/${timestamp}.json`;
        const historicalCommand = new PutObjectCommand({
          Bucket: this.#bucket,
          Key: historicalKey,
          Body: json,
          ContentType: "application/json",
        });
        await this.#s3Client.send(historicalCommand);
        console.log(
          `[SYSTEM]: Successfully wrote historical output to s3://${this.#bucket}/${historicalKey}`,
        );
      }
    } catch (error) {
      console.error(
        `[SYSTEM]: Failed to write output to s3://${this.#bucket}/${this.#key}:`,
        error,
      );
      throw error;
    }
  }
}
