import type { ConsumerSubscribeTopics, EachMessagePayload } from 'kafkajs';

export type KafkaTopic<T extends Record<string, string>> = T[keyof T];

export type TopicHandler = {
  subscribeOptions?: Omit<ConsumerSubscribeTopics, 'topics'>;
  eachMessage: (payload: EachMessagePayload) => Promise<void>;
};

export type TopicHandlersMap<T extends Record<string, string>> = Map<KafkaTopic<T>, TopicHandler>;

export const createKafkaTopicHelpers = <T extends Record<string, string>>(topics: T) => {
  const knownKafkaTopics = Object.values(topics) as KafkaTopic<T>[];

  const isKafkaTopic = (topic: string): topic is KafkaTopic<T> =>
    knownKafkaTopics.includes(topic as KafkaTopic<T>);

  return {
    knownKafkaTopics,
    isKafkaTopic,
  };
};
