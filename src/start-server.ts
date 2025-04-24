import { setupApp } from './setup-app';
import { ENV } from './config/env';
import { logger } from './tools';

setupApp().then((app) => {
  app.listen(process.env.PORT || ENV.PORT, () => {
    logger.info(`🚀 Running on port ${ENV.PORT}`);
  });
});
