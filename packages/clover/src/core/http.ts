import type { CloverEnvironment, CloverHost } from './types/index.js';
import { cloverErrorFromResponse } from './errors.js';

/**
 * Base hosts per Clover API and environment.
 *
 * @see https://docs.clover.com/dev/docs/ecommerce-api-tutorials
 */
const HOSTS: Record<CloverHost, Record<CloverEnvironment, string>> = {
  ecommerce: {
    sandbox: 'https://scl-sandbox.dev.clover.com',
    production: 'https://scl.clover.com',
  },
  platform: {
    sandbox: 'https://apisandbox.dev.clover.com',
    production: 'https://api.clover.com',
  },
};

/**
 * Configuration for the Clover HTTP client.
 */
export interface CloverHttpConfig {
  /** Clover API token (OAuth access token or API key) */
  apiToken: string;
  /** Merchant id — required for platform (`/v3/merchants/{mId}`) endpoints */
  merchantId?: string;
  /** Environment (default `sandbox`) */
  environment: CloverEnvironment;
  /** Override the `fetch` implementation (mainly for tests) */
  fetchImpl?: typeof fetch;
}

/**
 * Options for a single request.
 */
export interface RequestOptions {
  /** Query-string parameters */
  query?: Record<string, string | number | undefined>;
  /** JSON request body */
  body?: unknown;
  /** Idempotency key, sent as the `idempotency-key` header */
  idempotencyKey?: string;
}

/**
 * A small typed `fetch`-based HTTP client for the Clover Ecommerce and Platform
 * APIs. No SDK dependency; runs anywhere `fetch` and WebCrypto exist.
 *
 * Non-2xx responses are thrown as typed errors (see {@link cloverErrorFromResponse}).
 */
export class CloverHttp {
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly config: CloverHttpConfig) {
    // Bind to avoid "Illegal invocation" when a bare global fetch is passed.
    this.fetchImpl = (config.fetchImpl ?? globalThis.fetch).bind(globalThis);
  }

  /** The configured merchant id, if any. */
  get merchantId(): string | undefined {
    return this.config.merchantId;
  }

  private baseUrl(host: CloverHost): string {
    return HOSTS[host][this.config.environment];
  }

  /**
   * Perform a request and return the parsed JSON body.
   *
   * @throws {CloverError} On a non-2xx response or a network failure.
   */
  async request<T>(
    host: CloverHost,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = new URL(this.baseUrl(host) + path);
    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.config.apiToken}`,
      Accept: 'application/json',
    };
    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    if (options.idempotencyKey) {
      headers['idempotency-key'] = options.idempotencyKey;
    }

    const response = await this.fetchImpl(url, {
      method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    const text = await response.text();
    // A fronting gateway can return a non-JSON body (e.g. an HTML 502/503).
    // Don't let JSON.parse throw and discard the HTTP status — callers need the
    // status to distinguish retryable errors (429/503) from the rest.
    let json: unknown;
    try {
      json = text ? JSON.parse(text) : undefined;
    } catch {
      json = undefined;
    }

    if (!response.ok) {
      throw cloverErrorFromResponse(response.status, json, response.headers.get('x-request-id'));
    }

    return json as T;
  }
}
