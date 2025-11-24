import { checkEnvVariables } from '../../shared/env-variables.ts';
import type { Logger } from '../../shared/logger.ts';

export const SENDER_ENV_VARIABLES = {
  KAFKA_BROKERS: 'KAFKA_BROKERS',
  KAFKA_GROUP_ID: 'KAFKA_GROUP_ID',
} as const;

export type SenderEnvVariable = keyof typeof SENDER_ENV_VARIABLES;

export const senderEnvVariables: Record<SenderEnvVariable, string | undefined> = {
  KAFKA_BROKERS: Deno.env.get(SENDER_ENV_VARIABLES.KAFKA_BROKERS) ?? undefined,
  KAFKA_GROUP_ID: Deno.env.get(SENDER_ENV_VARIABLES.KAFKA_GROUP_ID) ?? undefined,
};

export const validateSenderEnv = (logger: Logger) =>
  checkEnvVariables<SenderEnvVariable>(senderEnvVariables, logger);
