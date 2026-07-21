export interface ChunkMetadata {
  chunkIndex: number;
  startOffset: number;
  endOffset: number;
  tokenCount?: number;
}

export interface Chunk {
  id: string;
  content: string;
  embedding?: number[];
  metadata: ChunkMetadata;
}
export interface EmbeddedChunk extends Chunk {
  embedding: number[];
}
