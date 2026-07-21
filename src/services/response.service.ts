import { Intent, ResponseMessage } from "../types/intent";
import { ChatService } from "./chat.service";
import { MessageRouterService } from "./message-router.service";

export class ResponseService {
  constructor(
    private readonly router: MessageRouterService,
    private readonly chatService: ChatService
  ) {}

  async reply(message: string): Promise<ResponseMessage> {
    const intent = this.router.detect(message);

    switch (intent) {
      case Intent.GREETING:
        return {
          text: "Hi 👋 Welcome to Patra Builders. How can I help you today?",
        };

      case Intent.THANKS:
        return {
          text: "You're welcome! Let me know if you have any questions about our construction services.",
        };

      case Intent.GOODBYE:
        return {
          text: "Thank you for contacting Patra Builders. Have a great day!",
        };

      case Intent.BUILDER_QUERY:
        return this.chatService.answer(message);

      default:
        return { text: "I'm sorry, I didn't understand that." };
    }
  }
}
