/**
 * The ONLY place that calls the backend with fetch.
 * Features wrap these helpers in their own api.ts (TanStack Query hooks).
 */
const BASE_URL = '/api';

export class ApiError extends Error {
  readonly status: number;
  /** Stable error code from the backend (see backend/src/common/error-codes.ts). */
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type Query = Record<string, string | number | boolean | undefined | null>;

interface RequestOptions {
  query?: Query;
  body?: unknown;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: Query): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  }
  const qs = params.toString();
  return `${BASE_URL}${path}${qs ? `?${qs}` : ''}`;
}

async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  const isForm = options.body instanceof FormData;
  const response = await fetch(buildUrl(path, options.query), {
    method,
    credentials: 'include', // the JWT travels in an httpOnly cookie
    headers:
      options.body !== undefined && !isForm ? { 'Content-Type': 'application/json' } : undefined,
    body:
      options.body === undefined
        ? undefined
        : isForm
          ? (options.body as FormData)
          : JSON.stringify(options.body),
    signal: options.signal,
  });

  if (response.status === 204) return undefined as T;

  const data: unknown = await response.json().catch(() => undefined);
  if (!response.ok) {
    const body = (data ?? {}) as { code?: string; message?: string; details?: unknown };
    throw new ApiError(
      response.status,
      body.code ?? 'INTERNAL_ERROR',
      body.message ?? response.statusText,
      body.details,
    );
  }
  return data as T;
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
};
