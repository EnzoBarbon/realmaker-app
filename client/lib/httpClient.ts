import { createApiClient } from '@realmaker/shared';

const baseUrl = process.env.EXPO_PUBLIC_API_URL ?? '';
export const api = createApiClient(baseUrl);
