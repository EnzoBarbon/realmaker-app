import { createKafkaTopicHelpers } from '../../shared/kafka-helpers.ts';
import { createConsumer, createProducer } from '../../shared/kafka.ts';
import { initPrisma } from '../../shared/prisma.ts';
import { KAFKA_TOPICS } from '../../shared/types.ts';
import { aiEngineEnvVariables, validateAiEngineEnv } from './env.ts';
import { aiEngineLogger } from './logger.ts';
import { createTopicHandlers } from './topics/topics-handlers.ts';

const { knownKafkaTopics: _knownKafkaTopics, isKafkaTopic } = createKafkaTopicHelpers(KAFKA_TOPICS);

validateAiEngineEnv(aiEngineLogger);

const prisma = initPrisma(aiEngineLogger, aiEngineEnvVariables.DATABASE_URL!);
const producer = await createProducer(aiEngineEnvVariables.KAFKA_BROKERS!);
const topicHandlers = createTopicHandlers({
  prisma,
  producer,
  logger: aiEngineLogger,
});

const consumer = await createConsumer(
  aiEngineEnvVariables.KAFKA_GROUP_ID!,
  aiEngineEnvVariables.KAFKA_BROKERS!,
);

for (const [topic, config] of topicHandlers) {
  await consumer.subscribe({ topic, ...config.subscribeOptions });
}

aiEngineLogger.info('🚀 AI Engine Service started ✨');

await consumer.run({
  eachMessage: async (payload) => {
    if (!isKafkaTopic(payload.topic)) {
      aiEngineLogger.warn(`Received message for unknown topic "${payload.topic}"`);
      return;
    }

    const handler = topicHandlers.get(payload.topic);

    if (!handler) {
      aiEngineLogger.warn(`No handler configured for topic "${payload.topic}"`);
      return;
    }

    await handler.eachMessage(payload);
  },
});
