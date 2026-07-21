export interface DocumentMetadata {
  documentId: string;
  fileName: string;
  extension: string;
  absolutePath: string;
  hash: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
}

export interface DocumentContent {
  metadata: DocumentMetadata;
  content: string;
}
