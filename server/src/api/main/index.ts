import { initPrisma } from '../../shared/prisma.ts';
import { createAuth, createAuthMiddleware } from '../_shared/auth.ts';
import { createErrorMiddleware } from '../_shared/middleware.ts';
import { EdgeFunctionPipeline } from '../_shared/pipeline.ts';
import { apiEnvVariables, resolveApiPort, validateApiEnv } from './env.ts';
import { apiLogger } from './logger.ts';

validateApiEnv(apiLogger);

const prisma = initPrisma(apiLogger, apiEnvVariables.DATABASE_URL!);
const pipeline = new EdgeFunctionPipeline(prisma, apiLogger);
const auth = createAuth(prisma);

pipeline.addGlobalMiddleware(createErrorMiddleware(apiLogger));
pipeline.addGlobalMiddleware(createAuthMiddleware(auth, apiLogger));

await pipeline.autoRegisterEndpoints('../endpoints/');

const servePort = resolveApiPort();

apiLogger.info('🚀 API Service started ✨');

const apiRequestHandler = (req: Request) => pipeline.processRequest(req);

if (servePort) {
  Deno.serve({ port: servePort }, apiRequestHandler);
} else {
  Deno.serve(apiRequestHandler);
}
