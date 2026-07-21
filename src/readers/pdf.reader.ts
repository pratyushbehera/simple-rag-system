import fs from "fs/promises";

import { BaseReader } from "./base.reader";
import PdfParse from "@cedrugs/pdf-parse";

export class PdfReader extends BaseReader {
  supports(extension: string) {
    return extension === ".pdf";
  }

  protected async extractText(filePath: string): Promise<string> {
    const buffer = await fs.readFile(filePath);

    const result = await PdfParse(buffer);

    return result.text;
  }
}
