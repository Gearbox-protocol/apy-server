import { writeFile } from "fs/promises";

import { json_stringify } from "../../core/utils";
import type { OutputWriter } from "./index";

export class FileWriter implements OutputWriter {
  constructor(private readonly filePath: string) {}

  async write(data: unknown): Promise<void> {
    try {
      const json = json_stringify(data, 2);
      await writeFile(this.filePath, json, "utf-8");
      console.log(`[SYSTEM]: Successfully wrote output to ${this.filePath}`);
    } catch (error) {
      console.error(
        `[SYSTEM]: Failed to write output to ${this.filePath}:`,
        error,
      );
      throw error;
    }
  }
}
