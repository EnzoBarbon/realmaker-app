import { TopicHandlersMap } from '../../../shared/kafka-helpers.ts';
import { KAFKA_TOPICS } from '../../../shared/types.ts';
import { handleEgressMessage } from './egress-handler.ts';

export const senderTopicHandlers: TopicHandlersMap<typeof KAFKA_TOPICS> = new Map([
  [
    KAFKA_TOPICS.EGRESS,
    {
      subscribeOptions: { fromBeginning: true },
      eachMessage: handleEgressMessage,
    },
  ],
]);
