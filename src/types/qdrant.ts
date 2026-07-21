export interface QdrantPayload extends Record<string, unknown> {
  documentId: string;
  fileName: string;
  extension: string;
  fileHash: string;
  absolutePath: string;
  chunkIndex: number;
  content: string;
  createdAt: string;
  modifiedAt: string;
}
