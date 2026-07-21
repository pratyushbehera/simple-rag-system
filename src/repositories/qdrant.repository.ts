import { QdrantClient } from "@qdrant/js-client-rest";

import { env } from "../config/env";
import { Chunk, EmbeddedChunk } from "../types/chunk";
import { SearchResult } from "../types/search";
import { QdrantPayload } from "../types/qdrant";
import { VectorRepository } from "./vector.repository";

export class QdrantRepository implements VectorRepository {
  constructor(
    private readonly client: QdrantClient,

    private readonly vectorSize: number
  ) {}

  async initialize(): Promise<void> {
    const collections = await this.client.getCollections();

    const exists = collections.collections.some(
      (c) => c.name === env.QDRANT_COLLECTION
    );

    if (exists) {
      return;
    }

    if (!exists) {
      await this.client.createCollection(env.QDRANT_COLLECTION, {
        vectors: {
          size: this.vectorSize,
          distance: "Cosine",
        },
      });
    }

    // Always ensure payload indexes exist
    await this.client.createPayloadIndex(env.QDRANT_COLLECTION, {
      field_name: "fileHash",
      field_schema: "keyword",
    });

    await this.client.createPayloadIndex(env.QDRANT_COLLECTION, {
      field_name: "documentId",
      field_schema: "keyword",
    });
  }

  async upsert(
    chunks: EmbeddedChunk[],

    payloadBuilder: (chunk: EmbeddedChunk) => QdrantPayload
  ): Promise<void> {
    const points = chunks.map((chunk) => ({
      id: chunk.id,
      vector: chunk.embedding,
      payload: payloadBuilder(chunk),
    }));

    await this.client.upsert(env.QDRANT_COLLECTION, {
      wait: true,
      points: points,
    });
  }

  async search(
    vector: number[],

    limit: number
  ): Promise<SearchResult[]> {
    const results = await this.client.search(env.QDRANT_COLLECTION, {
      vector,

      limit,
    });

    return results.map((result) => ({
      score: result.score,

      content: result.payload?.content as string,

      metadata: result.payload ?? {},
    }));
  }

  async deleteDocument(documentId: string): Promise<void> {
    await this.client.delete(env.QDRANT_COLLECTION, {
      filter: {
        must: [
          {
            key: "documentId",

            match: {
              value: documentId,
            },
          },
        ],
      },
    });
  }

  async exists(fileHash: string): Promise<boolean> {
    const response = await this.client.scroll(env.QDRANT_COLLECTION, {
      limit: 1,

      filter: {
        must: [
          {
            key: "fileHash",

            match: {
              value: fileHash,
            },
          },
        ],
      },
    });

    return response.points.length > 0;
  }
}
