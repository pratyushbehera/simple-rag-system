// src/index.ts
import { createApp } from "./app";

// Initialize the async app instance
const appPromise = createApp();

// FIX: Export a default function that proxies requests to your Express app
export default async function handler(req: any, res: any) {
  const app = await appPromise;
  return app(req, res);
}
