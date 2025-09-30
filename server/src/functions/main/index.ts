import { PrismaClient } from '../../../prisma/generated/client.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { EdgeFunctionPipeline } from '../_shared/pipeline.ts';

const prisma = new PrismaClient({ datasources: { db: { url: Deno.env.get('DATABASE_URL')! } } });
const pipeline = new EdgeFunctionPipeline(prisma);

await pipeline.autoRegisterEndpoints('../endpoints/');

Deno.serve((req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  return pipeline.processRequest(req);
});
