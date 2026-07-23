import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  PORT: z.string(),
  QDRANT_URL: z.string().url(),
  QDRANT_API_KEY: z.string(),
  QDRANT_COLLECTION: z.string(),
  OPENROUTER_API_KEY: z.string(),
  WATCH_FOLDER: z.string(),
  LOG_LEVEL: z.string().default("info"),
  JINA_API_KEY: z.string(),
  JINA_MODEL: z.string(),
  JINA_API_URL: z.url()
});

export const env = schema.parse(process.env);
