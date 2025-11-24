import type { Producer } from 'kafkajs';

import { EdgeFunctionPipeline } from '../../../api/_shared/pipeline.ts';
import { createWhatsappEndpoint } from './whatsapp.ts';

export const registerWebhookEndpoints = (pipeline: EdgeFunctionPipeline, producer: Producer) => {
  pipeline.registerEndpoint('webhook', createWhatsappEndpoint(producer));
};
