import { EmbeddingModel, FlagEmbedding } from "fastembed";

import { EmbeddingProvider } from "./embedding.provider";

export class FastEmbedProvider implements EmbeddingProvider {
  private embedding?: FlagEmbedding;

  async initialize(): Promise<void> {
    if (this.embedding) {
      return;
    }

    this.embedding = await FlagEmbedding.init({
      model: EmbeddingModel.BGESmallENV15,
    });
  }

  async embed(text: string): Promise<number[]> {
    if (!this.embedding) {
      throw new Error("Embedding provider not initialized.");
    }

    const iterator = this.embedding.embed([text]);

    for await (const vector of iterator) {
      return Array.from(vector[0]);
    }

    throw new Error("Embedding generation failed.");
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    if (!this.embedding) {
      throw new Error("Embedding provider not initialized.");
    }

    const vectors: number[][] = [];

    for await (const batch of this.embedding.embed(texts)) {
      vectors.push(...batch.map((v) => Array.from(v)));
    }

    return vectors;
  }

  dimensions(): number {
    return 384;
  }
}
