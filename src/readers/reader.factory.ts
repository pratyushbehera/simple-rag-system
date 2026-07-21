import { DocumentReader } from "./document-reader";

import { TextReader } from "./text.reader";
import { MarkdownReader } from "./markdown.reader";
import { PdfReader } from "./pdf.reader";
import { DocxReader } from "./docx.reader";
import { PptxReader } from "./pptx.reader";

export class ReaderFactory {
  private readonly readers: DocumentReader[];

  constructor() {
    this.readers = [
      new TextReader(),
      new MarkdownReader(),
      new PdfReader(),
      new DocxReader(),
      new PptxReader(),
    ];
  }

  getReader(extension: string): DocumentReader {
    const reader = this.readers.find((r) => r.supports(extension));

    if (!reader) {
      throw new Error(`Unsupported file type ${extension}`);
    }

    return reader;
  }
}
