import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// Strict security headers applied to every SSR response.
// CSP is intentionally permissive on connect-src (Supabase + Lovable AI) and
// script-src (Vite HMR + inline hydration script), but blocks framing, MIME sniffing,
// and cross-origin data leaks.
function withSecurityHeaders(response: Response, request: Request): Response {
  const url = new URL(request.url);
  // Do not touch API responses — clients set their own content-type/CORS.
  if (url.pathname.startsWith("/api/")) return response;

  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=()",
  );
  headers.set("X-DNS-Prefetch-Control", "on");
  // Force HTTPS for 2 years, include subdomains, allow preload list submission.
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  // Isolate the browsing context so cross-origin pages can't peek into ours.
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Cross-Origin-Resource-Policy", "same-site");
  // Reveal only the origin, not the referrer path, to cross-origin destinations.
  headers.set("Origin-Agent-Cluster", "?1");
  // Legacy XSS auditor — modern browsers ignore, but harmless on old ones.
  headers.set("X-XSS-Protection", "0");
  // Never let hosts change our detected content-type.
  headers.set("X-Permitted-Cross-Domain-Policies", "none");

  // Enforced CSP — allows Supabase + fonts + inline styles for Tailwind runtime
  // and inline hydration scripts. `frame-ancestors` keeps the Lovable editor preview working.
  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' https://fonts.gstatic.com data:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
      "connect-src 'self' https: wss:",
      "worker-src 'self' blob:",
      "media-src 'self' https: data: blob:",
      "object-src 'none'",
      "frame-ancestors 'self' https://lovable.dev https://*.lovable.app https://*.lovable.dev",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      return withSecurityHeaders(normalized, request);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
          "X-Frame-Options": "SAMEORIGIN",
        },
      });
    }
  },
};
