import z from 'zod';
import { logger } from '../tools';
import { BadRequestException } from '@nestjs/common';

const preprocessNumber = z.preprocess((value) => {
  if (value) {
    if (Number.isNaN(+value)) {
      throw new BadRequestException(`Invalid number: ${value}`);
    }

    return +value;
  }

  return undefined;
}, z.number());

const EnvVariablesSchema = z.object({
  PORT: preprocessNumber.optional().default(3000),
  CORS_ALLOWED_HOST_PAINEL: z.string(),
  CORS_ALLOWED_HOST_COLETOR: z.string(),
  CRON_HOUR: z.preprocess((value) => (value ? +value : undefined), z.number().optional()).default(1),
  DB_TYPE: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.preprocess((value) => +value, z.number()),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_TIMEOUT: preprocessNumber.optional(),
  BODY_SIZE_LIMIT: z.string().optional().default('80mb'),
  FIXED_TOKEN: z.string(),
});

type IEnvVariables = Required<z.infer<typeof EnvVariablesSchema>>;

export const ENV = {} as IEnvVariables;

export const loadEnvs = () => {
  logger.trace('Environment variables', { envs: process.env });

  const envs = EnvVariablesSchema.parse(process.env);

  logger.debug('Loaded environment variables', { envs });

  Object.assign(ENV, envs);
};
