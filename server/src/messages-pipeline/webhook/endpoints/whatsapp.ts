import type { Producer } from 'kafkajs';

import type { EndpointConfig } from '../../../api/_shared/types.ts';
import { ApiError } from '../../../api/_shared/types.ts';
import { IngressEvent, KAFKA_TOPICS } from '../../../shared/types.ts';
import { webhookLogger } from '../logger.ts';

export type WhatsappWebhookBody = {
  from: string;
  body: string;
};

export const createWhatsappEndpoint = (
  producer: Producer,
): EndpointConfig<WhatsappWebhookBody, { status: string }> => ({
  method: 'POST',
  path: '/whatsapp',
  description: 'Receives WhatsApp webhook events and enqueues them into Kafka',
  handler: async ({ req }) => {
    let body: WhatsappWebhookBody;

    try {
      body = (await req.json()) as WhatsappWebhookBody;
    } catch (error) {
      webhookLogger.error(`Invalid JSON payload: ${error}`);
      throw new ApiError('Invalid JSON body', 400);
    }

    if (!body?.from || !body?.body) {
      throw new ApiError('Missing "from" or "body"', 400);
    }

    const event: IngressEvent = {
      type: 'WHATSAPP_MESSAGE',
      payload: {
        from: body.from,
        body: body.body,
        timestamp: Date.now(),
        messageId: crypto.randomUUID(),
      },
    };

    await producer.send({
      topic: KAFKA_TOPICS.INGRESS,
      messages: [{ value: JSON.stringify(event) }],
    });

    webhookLogger.info(`Queued WhatsApp message from ${body.from}`);

    return { data: { status: 'queued' } };
  },
});
