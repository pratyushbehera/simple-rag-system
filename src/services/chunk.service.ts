import { ChunkerFactory } from "../chunkers/chunker.factory";
import { Chunk } from "../types/chunk";

export class ChunkService {
  private readonly factory = new ChunkerFactory();

  async chunk(
    text: string,

    extension: string
  ): Promise<Chunk[]> {
    const chunker = this.factory.getChunker(extension);

    return chunker.chunk(text);
  }
}
