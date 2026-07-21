import fs from "fs/promises";

import { BaseReader } from "./base.reader";

export class TextReader extends BaseReader {
  supports(extension: string) {
    return extension === ".txt";
  }

  protected async extractText(filePath: string): Promise<string> {
    return fs.readFile(filePath, "utf8");
  }
}
