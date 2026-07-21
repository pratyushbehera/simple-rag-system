import fs from "fs/promises";

import { BaseReader } from "./base.reader";

export class MarkdownReader extends BaseReader {
  supports(extension: string) {
    return extension === ".md";
  }

  protected async extractText(filePath: string): Promise<string> {
    return fs.readFile(filePath, "utf8");
  }
}
