import { AuthUser } from '@/store/auth';
import * as SecureStore from 'expo-secure-store';

export type HttpClientOptions = {
  baseUrl: string;
  getToken: () => Promise<string | null>;
};

export class HttpClient {
  private baseUrl: string;
  private getToken: () => Promise<string | null>;

  constructor(opts: HttpClientOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/$/, '');
    this.getToken = opts.getToken;
  }

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await this.getToken();
    const headers = new Headers(init.headers);
    headers.set('content-type', 'application/json');
    if (token) headers.set('authorization', `Bearer ${token}`);

    const res = await fetch(`${this.baseUrl}${path}`, { ...init, headers });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error ?? 'Request failed');
    return (json?.data ?? json) as T;
  }

  private get<T>(path: string) {
    return this.request<T>(path, { method: 'GET' });
  }
  private post<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) });
  }

  getUser() {
    return this.get<AuthUser>('/auth/get-user');
  }

  login(email: string, password: string) {
    return this.post<{ token: string }>('/auth/login', { email, password });
  }
}

const baseUrl = process.env.EXPO_PUBLIC_API_URL;
export const api = createApiClient(baseUrl ?? '');

const TOKEN_KEY = 'auth_token';

export async function saveToken(token: string) {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export async function getToken(): Promise<string | null> {
  try {
    return (await SecureStore.getItemAsync(TOKEN_KEY)) ?? null;
  } catch {
    return localStorage.getItem(TOKEN_KEY);
  }
}

export async function clearToken() {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function createApiClient(baseUrl: string) {
  return new HttpClient({ baseUrl, getToken });
}
