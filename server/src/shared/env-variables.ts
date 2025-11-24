import 'dotenv/load';
import { Logger } from './logger.ts';

export function checkEnvVariables<T extends string>(
  envVariablesMap: Record<T, string | undefined>,
  logger: Logger,
  config: { throwOnNotFound: boolean } = { throwOnNotFound: false },
) {
  Object.entries(envVariablesMap).forEach(([key, value]) => {
    if (!value && config.throwOnNotFound) {
      logger.error(`Environment variable ${key} is not set`);
      throw new Error(`Environment variable ${key} is not set`);
    } else if (!value) {
      logger.warn(`Environment variable ${key} is not set`);
    } else {
      logger.info(`Environment variable ${key} is set to ${value}`);
    }
  });
}
