import path from "path";

import { ReaderFactory } from "../readers/reader.factory";
import { DocumentContent } from "../types/document";

export class ReaderService {
  private readonly factory = new ReaderFactory();

  async read(filePath: string): Promise<DocumentContent> {
    const extension = path.extname(filePath).toLowerCase();

    const reader = this.factory.getReader(extension);

    return reader.read(filePath);
  }
}
