import { Consumer, Kafka, Producer } from 'kafkajs';

import { KAFKA_CLIENT_ID } from './types.ts';

let kafkaInstance: Kafka | null = null;

export function getKafka(brokers: string[] | string): Kafka {
  if (!kafkaInstance) {
    if (typeof brokers === 'string') {
      brokers = [brokers];
    }
    kafkaInstance = new Kafka({
      clientId: KAFKA_CLIENT_ID,
      brokers,
    });
  }
  return kafkaInstance;
}

export async function createProducer(brokers: string[] | string): Promise<Producer> {
  const kafka = getKafka(brokers);
  const producer = kafka.producer();
  await producer.connect();
  return producer;
}

export async function createConsumer(
  groupId: string,
  brokers: string[] | string,
): Promise<Consumer> {
  const kafka = getKafka(brokers);
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  return consumer;
}
