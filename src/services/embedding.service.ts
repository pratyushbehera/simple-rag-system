import { Chunk, EmbeddedChunk } from "../types/chunk";
import { EmbeddingProvider } from "../providers/embedding.provider";

export class EmbeddingService {
  constructor(private readonly provider: EmbeddingProvider) {}

  async initialize(): Promise<void> {
    await this.provider.initialize();
  }

  async embed(text: string): Promise<number[]> {
    return this.provider.embed(text, "retrieval.query");
  }

  async embedChunks(chunks: Chunk[]): Promise<EmbeddedChunk[]> {
    if (!chunks.length) {
      return [];
    }

    const vectors = await this.provider.embedBatch(
      chunks.map((c) => c.content),
      "retrieval.passage"
    );

    return chunks.map((chunk, index) => ({
      ...chunk,
      embedding: vectors[index],
    }));
  }

  dimensions(): number {
    return this.provider.dimensions();
  }
}
