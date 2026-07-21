import { Router } from "express";

import { WhatsAppController } from "../controllers/whatsapp.controller";

export function createWhatsappRoutes(controller: WhatsAppController) {
  const router = Router();

  router.post("/webhook", controller.webhook.bind(controller));

  return router;
}
