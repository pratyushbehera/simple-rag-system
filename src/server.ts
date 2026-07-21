import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

async function bootstrap() {
  const app = await createApp();

  app.listen(env.PORT, () => {
    logger.info(`Server started on port ${env.PORT}`);
  });
}

bootstrap();
