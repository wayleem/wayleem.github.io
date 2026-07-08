import { useEffect, useRef, useState, type FormEvent } from 'react';

const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined;

export default function Modal({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    firstField.current?.focus();
    if (SITE_KEY && !document.getElementById('cf-turnstile-script')) {
      const s = document.createElement('script');
      s.id = 'cf-turnstile-script';
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', { method: 'POST', body: new FormData(form) });
      if (res.ok) {
        setStatus('ok');
        form.reset();
      } else setStatus('err');
    } catch {
      setStatus('err');
    }
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Send a message" onClick={onClose}>
      <div className="modal__card" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close" type="button">×</button>
        <h2 className="modal__title">say something</h2>
        {status === 'ok' ? (
          <p className="modal__done">sent — i'll get back to you.</p>
        ) : (
          <form className="modal__form" onSubmit={onSubmit}>
            <input ref={firstField} name="name" placeholder="name" required maxLength={120} autoComplete="name" />
            <input name="email" type="email" placeholder="email" required maxLength={200} autoComplete="email" />
            <textarea name="message" placeholder="message" required maxLength={4000} rows={4} />
            {SITE_KEY ? <div className="cf-turnstile" data-sitekey={SITE_KEY} /> : null}
            <button type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'sending…' : 'send'}
            </button>
            {status === 'err' ? <p className="modal__err">didn't send — email me directly?</p> : null}
          </form>
        )}
      </div>
    </div>
  );
}
