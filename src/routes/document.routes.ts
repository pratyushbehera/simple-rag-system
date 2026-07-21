import { Router } from "express";

import { DocumentController } from "../controllers/document.controller";

export function createDocumentRoutes(controller: DocumentController) {
  const router = Router();

  router.get("/health", controller.health);

  router.post("/ingest", controller.ingest);

  router.post("/search", controller.search);

  return router;
}
