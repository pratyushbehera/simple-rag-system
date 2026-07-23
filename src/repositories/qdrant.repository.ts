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
    try {
      await this.client.getCollection(env.QDRANT_COLLECTION);
    } catch (err: any) {
      if (err.status === 404) {
        await this.client.createCollection(env.QDRANT_COLLECTION, {
          vectors: {
            size: this.vectorSize,
            distance: "Cosine",
          },
        });
      } else {
        throw err;
      }
    }

    // Always ensure indexes exist
    await Promise.all([
      this.ensureIndex("fileHash"),
      this.ensureIndex("documentId"),
    ]);
  }

  private async ensureIndex(field: string) {
    try {
      await this.client.createPayloadIndex(env.QDRANT_COLLECTION, {
        field_name: field,
        field_schema: "keyword",
      });
    } catch (err: any) {
      // Ignore "already exists"
      if (
        err.status !== 409 &&
        !err?.data?.status?.error?.includes("already exists")
      ) {
        throw err;
      }
    }
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
