import { Chunk } from "../types/chunk";

export interface Chunker {
  supports(extension: string): boolean;
  chunk(text: string): Promise<Chunk[]>;
}
