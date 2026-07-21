export enum Intent {
  GREETING = "GREETING",
  THANKS = "THANKS",
  GOODBYE = "GOODBYE",
  BUILDER_QUERY = "BUILDER_QUERY",
}

export interface ResponseMessage {
  text: string;
}
