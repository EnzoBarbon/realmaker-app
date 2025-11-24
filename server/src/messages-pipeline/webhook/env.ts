import { checkEnvVariables } from '../../shared/env-variables.ts';
import type { Logger } from '../../shared/logger.ts';

export const WEBHOOK_ENV_VARIABLES = {
  DATABASE_URL: 'DATABASE_URL',
  PORT: 'PORT',
  KAFKA_BROKERS: 'KAFKA_BROKERS',
} as const;

export type WebhookEnvVariable = keyof typeof WEBHOOK_ENV_VARIABLES;

export const webhookEnvVariables: Record<WebhookEnvVariable, string | undefined> = {
  DATABASE_URL: Deno.env.get(WEBHOOK_ENV_VARIABLES.DATABASE_URL) ?? undefined,
  PORT: Deno.env.get(WEBHOOK_ENV_VARIABLES.PORT) ?? undefined,
  KAFKA_BROKERS: Deno.env.get(WEBHOOK_ENV_VARIABLES.KAFKA_BROKERS) ?? undefined,
};

export const validateWebhookEnv = (logger: Logger) =>
  checkEnvVariables<WebhookEnvVariable>(webhookEnvVariables, logger);
