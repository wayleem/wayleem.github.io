/// <reference types="astro/client" />

// Cloudflare Worker bindings + secrets, available at runtime via
// `Astro.locals.runtime.env` (server routes only). Local dev populates these
// from `.dev.vars` through the adapter's platformProxy.
interface Env {
  KEYSTATIC_SECRET: string;
  KEYSTATIC_GITHUB_CLIENT_ID: string;
  KEYSTATIC_GITHUB_CLIENT_SECRET: string;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
