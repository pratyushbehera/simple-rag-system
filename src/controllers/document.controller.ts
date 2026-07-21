import { Request, Response, NextFunction } from "express";

import { DocumentIngestionService } from "../services/document-ingestion.service";
import { DocumentSearchService } from "../services/document-search.service";

export class DocumentController {
  constructor(
    private readonly ingestionService: DocumentIngestionService,
    private readonly searchService: DocumentSearchService
  ) {}

  ingest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filePath } = req.body;

      await this.ingestionService.ingest(filePath);

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query, limit } = req.body;

      const results = await this.searchService.search(query, limit);

      res.json(results);
    } catch (error) {
      next(error);
    }
  };

  health = (req: Request, res: Response) => {
    res.json({
      status: "ok",
    });
  };
}
