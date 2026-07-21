import { Request, Response } from "express";
import { ResponseService } from "../services/response.service";

export class WhatsAppController {
  constructor(private readonly responseService: ResponseService) {}

  async webhook(req: Request, res: Response) {
    const messageValue = req.body?.Body;

    const message = typeof messageValue === "string" ? messageValue : "";
    const reply = await this.responseService.reply(message);

    res.type("text/xml").send(`
      <Response>
        <Message>${reply}</Message>
      </Response>
    `);
  }
}
