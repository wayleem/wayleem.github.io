/// <reference types="astro/client" />

// Cloudflare Worker bindings + secrets, available at runtime via
// `Astro.locals.runtime.env` (server routes only). Local dev populates these
// from `.dev.vars` through the adapter's platformProxy.
interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
  TURNSTILE_SECRET_KEY: string;
  KEYSTATIC_SECRET: string;
  KEYSTATIC_GITHUB_CLIENT_ID: string;
  KEYSTATIC_GITHUB_CLIENT_SECRET: string;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}

// Public, build-time-inlined vars (safe to expose to the client).
interface ImportMetaEnv {
  readonly PUBLIC_TURNSTILE_SITE_KEY: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
