import express from "express";

import { createDocumentRoutes } from "./routes/document.routes";

import { ApplicationContainer } from "./container/application";
import { DocumentController } from "./controllers/document.controller";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error";
import { WhatsAppController } from "./controllers/whatsapp.controller";
import { createWhatsappRoutes } from "./routes/whatsapp.routes";

export async function createApp() {
  const app = express();

  app.use(express.json());

  const container = new ApplicationContainer();

  await container.initialize();

  const controller = new DocumentController(
    container.ingestionService,
    container.searchService
  );
  const waController = new WhatsAppController(container.responseService);

  app.use("/api/documents", createDocumentRoutes(controller));
  app.use("/api/whatsapp", createWhatsappRoutes(waController));

  app.use(notFoundMiddleware);

  app.use(errorMiddleware);

  return app;
}
