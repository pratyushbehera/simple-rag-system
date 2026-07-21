import { ResponseMessage } from "../types/intent";

export interface LLMRequest {
  question: string;
  context: string;
}

export interface LLMProvider {
  generate(request: LLMRequest): Promise<ResponseMessage>;
}
