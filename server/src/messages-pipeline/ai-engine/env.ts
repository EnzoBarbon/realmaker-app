import { checkEnvVariables } from '../../shared/env-variables.ts';
import type { Logger } from '../../shared/logger.ts';

export const AI_ENGINE_ENV_VARIABLES = {
  DATABASE_URL: 'DATABASE_URL',
  PORT: 'PORT',
  KAFKA_BROKERS: 'KAFKA_BROKERS',
  KAFKA_TOPICS: 'KAFKA_TOPICS',
  KAFKA_GROUP_ID: 'KAFKA_GROUP_ID',
  KAFKA_CLIENT_ID: 'KAFKA_CLIENT_ID',
  KAFKA_CLIENT_SECRET: 'KAFKA_CLIENT_SECRET',
  KAFKA_CLIENT_TOKEN: 'KAFKA_CLIENT_TOKEN',
  KAFKA_CLIENT_TOKEN_SECRET: 'KAFKA_CLIENT_TOKEN_SECRET',
} as const;

export type AiEngineEnvVariable = keyof typeof AI_ENGINE_ENV_VARIABLES;

export const aiEngineEnvVariables: Record<AiEngineEnvVariable, string | undefined> = {
  DATABASE_URL: Deno.env.get(AI_ENGINE_ENV_VARIABLES.DATABASE_URL) ?? undefined,
  PORT: Deno.env.get(AI_ENGINE_ENV_VARIABLES.PORT) ?? undefined,
  KAFKA_BROKERS: Deno.env.get(AI_ENGINE_ENV_VARIABLES.KAFKA_BROKERS) ?? undefined,
  KAFKA_TOPICS: Deno.env.get(AI_ENGINE_ENV_VARIABLES.KAFKA_TOPICS) ?? undefined,
  KAFKA_GROUP_ID: Deno.env.get(AI_ENGINE_ENV_VARIABLES.KAFKA_GROUP_ID) ?? undefined,
  KAFKA_CLIENT_ID: Deno.env.get(AI_ENGINE_ENV_VARIABLES.KAFKA_CLIENT_ID) ?? undefined,
  KAFKA_CLIENT_SECRET: Deno.env.get(AI_ENGINE_ENV_VARIABLES.KAFKA_CLIENT_SECRET) ?? undefined,
  KAFKA_CLIENT_TOKEN: Deno.env.get(AI_ENGINE_ENV_VARIABLES.KAFKA_CLIENT_TOKEN) ?? undefined,
  KAFKA_CLIENT_TOKEN_SECRET:
    Deno.env.get(AI_ENGINE_ENV_VARIABLES.KAFKA_CLIENT_TOKEN_SECRET) ?? undefined,
};

export const validateAiEngineEnv = (logger: Logger) =>
  checkEnvVariables<AiEngineEnvVariable>(aiEngineEnvVariables, logger);
