import type { Producer } from 'kafkajs';
import type { PrismaClient } from '../../../../prisma/generated/client.ts';
import { TopicHandlersMap } from '../../../shared/kafka-helpers.ts';
import type { Logger } from '../../../shared/logger.ts';
import { KAFKA_TOPICS } from '../../../shared/types.ts';
import { whatsappHandler } from './whatsapp/handler.ts';

type TopicHandlerDeps = {
  prisma: PrismaClient;
  producer: Producer;
  logger: Logger;
};

export const createTopicHandlers = ({
  prisma,
  producer,
  logger,
}: TopicHandlerDeps): TopicHandlersMap<typeof KAFKA_TOPICS> =>
  new Map([
    [
      KAFKA_TOPICS.INGRESS,
      {
        subscribeOptions: { fromBeginning: true },
        eachMessage: whatsappHandler({ prisma, producer, logger }),
      },
    ],
  ]);
