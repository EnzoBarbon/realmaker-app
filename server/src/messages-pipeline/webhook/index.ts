import { EdgeFunctionPipeline } from '../../api/_shared/pipeline.ts';
import { createProducer } from '../../shared/kafka.ts';
import { initPrisma } from '../../shared/prisma.ts';
import { registerWebhookEndpoints } from './endpoints/index.ts';
import { validateWebhookEnv, webhookEnvVariables } from './env.ts';
import { webhookLogger } from './logger.ts';

validateWebhookEnv(webhookLogger);

const prisma = initPrisma(webhookLogger, webhookEnvVariables.DATABASE_URL!);
const producer = await createProducer(webhookEnvVariables.KAFKA_BROKERS!);
const pipeline = new EdgeFunctionPipeline(prisma, webhookLogger);

registerWebhookEndpoints(pipeline, producer);

const port = webhookEnvVariables.PORT ? Number(webhookEnvVariables.PORT) : undefined;
const serveInit = typeof port === 'number' && !Number.isNaN(port) ? { port } : undefined;

webhookLogger.info(
  serveInit?.port
    ? `🚀 Webhook Service listening on port ${serveInit.port}`
    : '🚀 Webhook Service started ✨',
);

const webhookRequestHandler = (req: Request) => pipeline.processRequest(req);

if (serveInit) {
  Deno.serve(serveInit, webhookRequestHandler);
} else {
  Deno.serve(webhookRequestHandler);
}
