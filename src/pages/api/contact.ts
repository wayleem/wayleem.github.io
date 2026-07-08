import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false; // on-demand SSR route (Cloudflare Worker)

const LIMITS = { name: 120, email: 200, message: 4000 };
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

async function passesTurnstile(token: string, secret: string | undefined, ip: string | null) {
  if (!secret) return true; // not configured (e.g. local dev) → skip
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

export const POST: APIRoute = async ({ request, locals }) => {
  // Secrets come from the Worker env at runtime; import.meta.env is the dev fallback.
  const env = { ...(import.meta.env as Record<string, string>), ...(locals.runtime?.env ?? {}) };

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, { error: 'Invalid form data' });
  }

  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const message = String(form.get('message') ?? '').trim();
  const token = String(form.get('cf-turnstile-response') ?? '');

  // Validate at the boundary.
  if (!name || !email || !message) return json(400, { error: 'Missing required fields' });
  if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
    return json(400, { error: 'A field is too long' });
  }
  if (!EMAIL_RE.test(email)) return json(400, { error: 'Invalid email' });

  const ip = request.headers.get('cf-connecting-ip');
  if (!(await passesTurnstile(token, env.TURNSTILE_SECRET_KEY, ip))) {
    return json(403, { error: 'Failed spam check' });
  }

  const apiKey = env.RESEND_API_KEY;
  const to = env.CONTACT_TO_EMAIL || 'wayleemh@gmail.com';

  if (!apiKey) {
    // Email not configured (local dev): accept so the flow is testable.
    console.log(`[contact] no RESEND_API_KEY — would email ${to}:`, { name, email });
    return json(200, { ok: true, dev: true });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: 'wayleem.com <contact@wayleem.com>', // must be a Resend-verified sender
    to,
    replyTo: email,
    subject: `Portfolio message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });
  if (error) return json(502, { error: 'Could not send email' });

  return json(200, { ok: true });
};

export const GET: APIRoute = () => new Response('Method Not Allowed', { status: 405 });
