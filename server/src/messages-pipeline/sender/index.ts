import { createKafkaTopicHelpers } from '../../shared/kafka-helpers.ts';
import { createConsumer } from '../../shared/kafka.ts';
import { KAFKA_TOPICS } from '../../shared/types.ts';
import { senderEnvVariables, validateSenderEnv } from './env.ts';
import { senderLogger } from './logger.ts';
import { senderTopicHandlers } from './topics/topics-handlers.ts';

validateSenderEnv(senderLogger);

const { isKafkaTopic } = createKafkaTopicHelpers(KAFKA_TOPICS);

const consumer = await createConsumer(
  senderEnvVariables.KAFKA_GROUP_ID!,
  senderEnvVariables.KAFKA_BROKERS!,
);

for (const [topic, config] of senderTopicHandlers) {
  await consumer.subscribe({ topic, ...config.subscribeOptions });
}

senderLogger.info('🚀 Sender Service started ✨');

await consumer.run({
  eachMessage: async (payload) => {
    if (!isKafkaTopic(payload.topic)) {
      senderLogger.warn(`Received message for unknown topic "${payload.topic}"`);
      return;
    }

    const handler = senderTopicHandlers.get(payload.topic);

    if (!handler) {
      senderLogger.warn(`No handler configured for topic "${payload.topic}"`);
      return;
    }

    await handler.eachMessage(payload);
  },
});
