import { EmbeddingService } from "./embedding.service";
import { VectorRepository } from "../repositories/vector.repository";

import { SearchResult } from "../types/search";

export class DocumentSearchService {
  constructor(
    private readonly embeddingService: EmbeddingService,

    private readonly repository: VectorRepository
  ) {}

  async search(
    query: string,

    limit = 5
  ): Promise<SearchResult[]> {
    const vector = await this.embeddingService.embed(query);

    return this.repository.search(vector, limit);
  }
}
