import { env } from "../config/env";
import { EmbeddingProvider } from "./embedding.provider";

interface JinaEmbeddingResponse {
  data: {
    embedding: number[];
    index: number;
  }[];
}

export class JinaEmbeddingProvider implements EmbeddingProvider {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly baseUrl = env.JINA_API_URL ?? "https://api.jina.ai/v1/embeddings";

  constructor() {
    this.apiKey = env.JINA_API_KEY ?? "";
    this.model = env.JINA_MODEL ?? "jina-embeddings-v3";
  }

  async initialize(): Promise<void> {
    if (!this.apiKey) {
      throw new Error("JINA_API_KEY is not configured.");
    }
  }

  async embed(text: string): Promise<number[]> {
    const embeddings = await this.embedBatch([text]);
    return embeddings[0];
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        task: "retrieval.passage",
        input: texts,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Jina API error (${response.status}): ${error}`);
    }

    const result = (await response.json()) as JinaEmbeddingResponse;

    return result.data
      .sort((a, b) => a.index - b.index)
      .map((item) => item.embedding);
  }

  dimensions(): number {
    return 1024;
  }
}
