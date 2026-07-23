import { qdrant } from "../config/qdrant";

import { ReaderService } from "../services/reader.service";
import { ChunkService } from "../services/chunk.service";
import { EmbeddingService } from "../services/embedding.service";
import { DocumentIngestionService } from "../services/document-ingestion.service";
import { DocumentSearchService } from "../services/document-search.service";

// import { FastEmbedProvider } from "../providers/fastembed.provider";

import { QdrantRepository } from "../repositories/qdrant.repository";
import { OpenRouterProvider } from "../providers/openrouter.provider";
import { ChatService } from "../services/chat.service";
import { MessageRouterService } from "../services/message-router.service";
import { ResponseService } from "../services/response.service";
import { JinaEmbeddingProvider } from "../providers/jina.provider";

export class ApplicationContainer {
  public readonly readerService: ReaderService;

  public readonly chunkService: ChunkService;

  public readonly embeddingService: EmbeddingService;

  public readonly ingestionService: DocumentIngestionService;

  public readonly searchService: DocumentSearchService;
  public readonly chatService: ChatService;
  public readonly messageRouter: MessageRouterService;
  public readonly responseService: ResponseService;

  public readonly repository: QdrantRepository;

  constructor() {
    const llmProvider = new OpenRouterProvider();

    const provider = new JinaEmbeddingProvider();

    this.embeddingService = new EmbeddingService(provider);

    this.readerService = new ReaderService();

    this.chunkService = new ChunkService();
    this.repository = new QdrantRepository(
      qdrant,
      this.embeddingService.dimensions()
    );

    this.ingestionService = new DocumentIngestionService(
      this.readerService,
      this.chunkService,
      this.embeddingService,
      this.repository
    );

    this.searchService = new DocumentSearchService(
      this.embeddingService,
      this.repository
    );

    this.chatService = new ChatService(this.searchService, llmProvider);
    this.messageRouter = new MessageRouterService();
    this.responseService = new ResponseService(
      this.messageRouter,
      this.chatService
    );
  }

  async initialize() {
    await this.embeddingService.initialize();

    await this.repository.initialize();
  }
}
