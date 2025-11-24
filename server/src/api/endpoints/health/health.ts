import { EndpointConfig, RequestContext } from '../../_shared/types.ts';

const healthHandler = (_context: RequestContext) => {
  // throw new Error('Not implemented');
  return Promise.resolve({ data: { status: 'ok' } satisfies { status: 'ok' } });
};

export const health: EndpointConfig<void, { status: 'ok' }> = {
  domain: 'health',
  method: 'GET',
  path: '/health',
  description: 'Check the health of the server',
  handler: healthHandler,
};
