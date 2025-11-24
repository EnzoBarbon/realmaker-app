import { OnboardingPayload } from './onboarding';
import { AuthUser, RegisterPayload } from './types';

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    if (!this.baseUrl) {
      console.warn('API base URL is not set. API calls will fail.');
    }
  }

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    if (!this.baseUrl) {
      throw new Error('API base URL is not configured');
    }

    const headers = new Headers(init.headers ?? {});
    if (!(init.body instanceof FormData) && !headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers,
      credentials: 'include',
    });

    let json: any = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }

    if (!res.ok) {
      const message = json?.error ?? 'Request failed';
      throw new Error(message);
    }

    return (json?.data ?? json) as T;
  }

  private get<T>(path: string) {
    return this.request<T>(path, { method: 'GET' });
  }
  private post<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) });
  }

  getUser() {
    return this.get<AuthUser>('/auth/me');
  }

  login(email: string, password: string) {
    return this.post<AuthUser>('/auth/login', { email, password });
  }

  register(payload: RegisterPayload) {
    return this.post<AuthUser>('/auth/register', payload);
  }

  logout() {
    return this.post<{ success: boolean }>('/auth/logout');
  }

  completeOnboarding(payload: OnboardingPayload) {
    return this.post<{ success: boolean }>('/onboarding/complete', payload);
  }
}

export function createApiClient(baseUrl: string) {
  return new HttpClient(baseUrl);
}
