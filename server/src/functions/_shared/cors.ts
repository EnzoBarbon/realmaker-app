export const corsHeaders: HeadersInit = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
  'access-control-allow-headers':
    'authorization,content-type,apikey,x-forwarded-for,cf-connecting-ip',
};

export function handleOptions(): Response {
  return new Response('ok', { status: 200, headers: corsHeaders });
}
