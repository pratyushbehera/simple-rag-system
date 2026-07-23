export type EmbeddingTask = "retrieval.query" | "retrieval.passage";

export interface EmbeddingProvider {
  initialize(): Promise<void>;
  embed(text: string, task?: EmbeddingTask): Promise<number[]>;
  embedBatch(texts: string[], task?: EmbeddingTask): Promise<number[][]>;
  dimensions(): number;
}
