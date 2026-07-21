import { DocumentContent } from "../types/document";

export interface DocumentReader {
  supports(extension: string): boolean;
  read(filePath: string): Promise<DocumentContent>;
}
