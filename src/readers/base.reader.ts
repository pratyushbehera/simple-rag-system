import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";

import { DocumentReader } from "./document-reader";
import { DocumentContent } from "../types/document";

export abstract class BaseReader implements DocumentReader {
  abstract supports(extension: string): boolean;

  protected abstract extractText(filePath: string): Promise<string>;

  async read(filePath: string): Promise<DocumentContent> {
    const stats = await fs.stat(filePath);

    const buffer = await fs.readFile(filePath);

    const content = await this.extractText(filePath);
    const hash = createHash("sha256").update(buffer).digest("hex");

    return {
      metadata: {
        documentId: hash,
        fileName: path.basename(filePath),

        extension: path.extname(filePath),

        absolutePath: filePath,

        hash,

        size: stats.size,

        createdAt: stats.birthtime,

        modifiedAt: stats.mtime,
      },

      content,
    };
  }
}
