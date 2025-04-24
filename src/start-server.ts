import { setupApp } from './setup-app';
import { ENV } from './config/env';
import { logger } from './tools';

setupApp().then((app) => {
  app.listen(process.env.PORT || ENV.PORT, () => {
    logger.info(`FC Health RFID running on port ${ENV.PORT}`);
  });
});
