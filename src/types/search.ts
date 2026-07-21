export interface SearchRequest {
  query: string;
  limit?: number;
}

export interface SearchResult {
  score: number;
  content: string;
  metadata: Record<string, unknown>;
}
