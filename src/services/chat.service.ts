import { LLMProvider } from "../providers/llm.provider";
import { ResponseMessage } from "../types/intent";
import { SearchResult } from "../types/search";
import { DocumentSearchService } from "./document-search.service";

export class ChatService {
  constructor(
    private readonly searchService: DocumentSearchService,
    private readonly llmProvider: LLMProvider
  ) {}

  private buildContext(results: SearchResult[]): string {
    return results.map((result) => result.content).join("\n\n---\n\n");
  }

  async answer(question: string): Promise<ResponseMessage> {
    const results = await this.searchService.search(question);

    if (!results.length) {
      return { text: "I couldn't find any relevant information." };
    }

    const context = this.buildContext(results);
    console.log(context, question);
    return this.llmProvider.generate({ context, question });
  }
}
