import { ReaderService } from "./reader.service";
import { ChunkService } from "./chunk.service";
import { EmbeddingService } from "./embedding.service";

import { VectorRepository } from "../repositories/vector.repository";

export class DocumentIngestionService {
  constructor(
    private readonly readerService: ReaderService,

    private readonly chunkService: ChunkService,

    private readonly embeddingService: EmbeddingService,

    private readonly repository: VectorRepository
  ) {}

  async ingest(filePath: string): Promise<void> {
    const document = await this.readerService.read(filePath);

    const exists = await this.repository.exists(document.metadata.hash);

    if (exists) {
      return;
    }

    const chunks = await this.chunkService.chunk(
      document.content,
      document.metadata.extension
    );

    const embeddedChunks = await this.embeddingService.embedChunks(chunks);

    await this.repository.upsert(
      embeddedChunks,

      (chunk) => ({
        documentId: document.metadata.documentId,

        fileName: document.metadata.fileName,

        extension: document.metadata.extension,

        fileHash: document.metadata.hash,

        absolutePath: document.metadata.absolutePath,

        chunkIndex: chunk.metadata.chunkIndex,

        content: chunk.content,

        createdAt: document.metadata.createdAt.toISOString(),

        modifiedAt: document.metadata.modifiedAt.toISOString(),
      })
    );
  }
}
