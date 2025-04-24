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
  ELFA_API_URL: z.string(),
  ELFA_API_USERNAME: z.string(),
  ELFA_API_PASSWORD: z.string(),
  PRINTER_INTEGRATION_API_URL: z.string(),
  PRINTER_INTEGRATION_API_USERNAME: z.string(),
  PRINTER_INTEGRATION_API_PASSWORD: z.string(),
  PRINTER_INTEGRATION_API_ENABLE: z.preprocess((value) => value === 'true', z.boolean()),
  RECAPTCHA_SECRET_KEY: z.string(),
  ELFAMED_API_URL: z.string(),
  ELFAMED_API_AUTHORIZATION: z.string(),
  COGNITO_POOL_ID: z.string(),
  COGNITO_CLIENT_ID: z.string(),
  ELFA_CONSIGNED_API_URL: z.string(),
  FIXED_TOKEN: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_BUCKET_NAME: z.string(),
  CLOUDFRONT_DOMAIN: z.string(),
  EMAIL_FROM: z.string(),
});

type IEnvVariables = Required<z.infer<typeof EnvVariablesSchema>>;

export const ENV = {} as IEnvVariables;

export const loadEnvs = () => {
  logger.trace('Environment variables', { envs: process.env });

  const envs = EnvVariablesSchema.parse(process.env);

  logger.debug('Loaded environment variables', { envs });

  Object.assign(ENV, envs);
};
