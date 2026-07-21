import { Intent } from "../types/intent";

export class MessageRouterService {
  private greetings = [
    "hi",
    "hello",
    "hey",
    "good morning",
    "good afternoon",
    "good evening",
    "namaste",
  ];

  private thanks = ["thanks", "thank you", "thx", "ty"];

  private goodbyes = ["bye", "goodbye", "see you", "take care"];

  detect(message: string): Intent {
    const text = message.trim().toLowerCase();

    if (this.matches(text, this.greetings)) {
      return Intent.GREETING;
    }

    if (this.matches(text, this.thanks)) {
      return Intent.THANKS;
    }

    if (this.matches(text, this.goodbyes)) {
      return Intent.GOODBYE;
    }

    return Intent.BUILDER_QUERY;
  }

  private matches(message: string, phrases: string[]): boolean {
    return phrases.some(
      (phrase) => message === phrase || message.startsWith(`${phrase} `)
    );
  }
}
