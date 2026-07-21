import { LLMProvider, LLMRequest } from "./llm.provider";
import { env } from "../config/env";
import { ResponseMessage } from "../types/intent";

export class OpenRouterProvider implements LLMProvider {
  async generate(request: LLMRequest): Promise<ResponseMessage> {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          temperature: 0.2,
          max_tokens: 500,
          stream: false,
          messages: [
            {
              role: "system",
              content: `
You are the AI assistant for Patra Builders.

Answer ONLY using the provided context.

If the answer is not available in the context, reply:

"I couldn't find that information in our documents. Please connect with the customer care"

Do not mention context, embeddings, vector search or retrieved documents.
Respond naturally like a customer support executive.
              `.trim(),
            },
            {
              role: "user",
              content: `
Context:
${request.context}

Question:
${request.question}
              `.trim(),
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error("OpenRouter request failed.");
    }

    const json = await response.json();

    return json.choices[0].message.content.trim();
  }
}
