import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/client.ts';
import { Logger } from './logger.ts';

export function initPrisma(logger: Logger, dataSourceUrl: string) {
  console.log('dataSourceUrl', dataSourceUrl);
  const adapter = new PrismaPg({ connectionString: dataSourceUrl });
  const prisma = new PrismaClient({ adapter });

  logger.success('Prisma client successfully initialized');
  return prisma;
}
