import { EndpointConfig, RequestContext } from '../_shared/types.ts';

export const domain = 'tests';

const handler = async (context: RequestContext<void>) => {
  const data = await context.prisma.test.findMany();
  return { data };
};

export const listTests: EndpointConfig<void, { id: number; name: string; createdAt: Date }[]> = {
  method: 'GET',
  path: '',
  description: 'List tests',
  handler,
};
