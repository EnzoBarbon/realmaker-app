import 'dotenv/load';
import { checkEnvVariables } from '../../shared/env-variables.ts';
import type { Logger } from '../../shared/logger.ts';

export const API_ENV_VARIABLES = {
  DATABASE_URL: 'DATABASE_URL',
  PORT: 'PORT',
} as const;

export type ApiEnvVariable = keyof typeof API_ENV_VARIABLES;

export const apiEnvVariables: Record<ApiEnvVariable, string | undefined> = {
  DATABASE_URL: Deno.env.get(API_ENV_VARIABLES.DATABASE_URL) ?? undefined,
  PORT: Deno.env.get(API_ENV_VARIABLES.PORT) ?? undefined,
};

export const validateApiEnv = (logger: Logger) =>
  checkEnvVariables<ApiEnvVariable>(apiEnvVariables, logger);

export const resolveApiPort = (): number | undefined => {
  const port = apiEnvVariables.PORT ? Number(apiEnvVariables.PORT) : undefined;
  return typeof port === 'number' && !Number.isNaN(port) ? port : undefined;
};
