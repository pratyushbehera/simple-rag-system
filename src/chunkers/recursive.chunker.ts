import { randomUUID } from "crypto";

import { Chunk } from "../types/chunk";
import { Chunker } from "./chunker";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export class RecursiveChunker implements Chunker {
  private readonly splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,

    chunkOverlap: 150,

    separators: ["\n\n", "\n", ". ", " ", ""],
  });

  supports(): boolean {
    return true;
  }

  async chunk(text: string): Promise<Chunk[]> {
    const docs = await this.splitter.createDocuments([text]);

    return docs.map((doc, index) => ({
      id: randomUUID(),

      content: doc.pageContent,

      metadata: {
        chunkIndex: index,

        startOffset: 0,

        endOffset: doc.pageContent.length,
      },
    }));
  }
}
