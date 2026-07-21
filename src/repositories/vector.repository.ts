import { Chunk } from "../types/chunk";
import { QdrantPayload } from "../types/qdrant";
import { SearchResult } from "../types/search";

export interface VectorRepository {
  initialize(): Promise<void>;

  upsert(
    chunks: Chunk[],
    payloadBuilder: (chunk: Chunk) => QdrantPayload
  ): Promise<void>;

  search(vector: number[], limit: number): Promise<SearchResult[]>;

  deleteDocument(documentId: string): Promise<void>;

  exists(fileHash: string): Promise<boolean>;
}
