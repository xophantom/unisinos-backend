import 'dotenv/config';
import 'source-map-support/register';
import { loadEnvs } from './config/env';

export async function startApplication() {
  loadEnvs();

  await import('./start-server');
}

startApplication();
