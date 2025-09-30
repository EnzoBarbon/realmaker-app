import 'https://deno.land/std@0.224.0/dotenv/load.ts';
import '../prisma/generated/client.ts';

// Delegate all requests to the functions main router
import './functions/main/index.ts';
