import type { EachMessagePayload, Producer } from 'kafkajs';

import { PrismaClient } from '../../../../../prisma/generated/client.ts';
import type { Logger } from '../../../../shared/logger.ts';
import { EgressEvent, IngressEvent, KAFKA_TOPICS } from '../../../../shared/types.ts';

type WhatsappHandlerDeps = {
  prisma: PrismaClient;
  producer: Producer;
  logger: Logger;
};

export function whatsappHandler({ prisma, producer, logger }: WhatsappHandlerDeps) {
  return async ({ message }: EachMessagePayload): Promise<void> => {
    if (!message.value) return;

    try {
      const event = JSON.parse(message.value.toString()) as IngressEvent;
      logger.info(`Processing message from ${event.payload.from}`);

      // 1. Find or Create Contact & Conversation
      let contact = await prisma.contact.findUnique({
        where: { phone: event.payload.from },
      });

      if (!contact) {
        contact = await prisma.contact.create({
          data: {
            phone: event.payload.from,
            name: 'Unknown',
          },
        });
        logger.info(`Created new contact: ${contact.id}`);
      }

      // Find latest active conversation or create new one
      let conversation = await prisma.conversation.findFirst({
        where: { contactId: contact.id },
        orderBy: { createdAt: 'desc' },
      });

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: { contactId: contact.id },
        });
      }

      // 2. Save Inbound Message
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          body: event.payload.body,
          direction: 'INBOUND',
        },
      });

      // 3. Mock AI Processing
      logger.info('Generating response...');
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1s delay
      const mockResponseText = `Hello! I received your message: "${event.payload.body}". This is an AI generated response.`;

      // 4. Save Outbound Message
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          body: mockResponseText,
          direction: 'OUTBOUND',
        },
      });

      // 5. Publish to Egress
      const responseEvent: EgressEvent = {
        to: event.payload.from,
        body: mockResponseText,
        originalMessageId: event.payload.messageId,
      };

      await producer.send({
        topic: KAFKA_TOPICS.EGRESS,
        messages: [{ value: JSON.stringify(responseEvent) }],
      });

      logger.info(`Response queued for ${event.payload.from}`);
    } catch (error) {
      console.error('[AI Engine] Error processing message:', error);
    }
  };
}

export const createWhatsappHandler = whatsappHandler;
