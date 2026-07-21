import fs from "fs/promises";

import mammoth from "mammoth";

import { BaseReader } from "./base.reader";

export class DocxReader extends BaseReader {
  supports(extension: string) {
    return extension === ".docx";
  }

  protected async extractText(filePath: string): Promise<string> {
    const buffer = await fs.readFile(filePath);

    const result = await mammoth.extractRawText({
      buffer,
    });

    return result.value;
  }
}
