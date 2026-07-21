import { BaseReader } from "./base.reader";

export class PptxReader extends BaseReader {
  supports(extension: string) {
    return extension === ".pptx";
  }

  protected async extractText() {
    return "";
  }
}
