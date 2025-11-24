import type { EachMessagePayload } from 'kafkajs';

import { EgressEvent } from '../../../shared/types.ts';
import { senderLogger } from '../logger.ts';

export const handleEgressMessage = async ({ message }: EachMessagePayload) => {
  if (!message.value) return;

  try {
    const event = JSON.parse(message.value.toString()) as EgressEvent;

    senderLogger.info(`📤 Queued notification for ${event.to}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    senderLogger.success(`Message delivered to ${event.to}`);
  } catch (error) {
    senderLogger.error(
      `[Sender] Error sending message: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};
