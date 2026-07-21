import { Chunker } from "./chunker";
import { RecursiveChunker } from "./recursive.chunker";

export class ChunkerFactory {
  private readonly chunkers: Chunker[];

  constructor() {
    this.chunkers = [new RecursiveChunker()];
  }

  getChunker(extension: string): Chunker {
    const chunker = this.chunkers.find((c) => c.supports(extension));

    if (!chunker) {
      throw new Error(`No chunker for ${extension}`);
    }

    return chunker;
  }
}
