import { useState } from 'react';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function CTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/early-access`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="get-the-app" className="relative py-20 sm:py-28">
      <div className="container-page">
        <div className="reveal relative overflow-hidden rounded-[2rem] border border-coral-500/20 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 px-6 py-16 text-center sm:px-12 sm:py-20">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-coral-500/20 blur-[100px]" />
            <div className="absolute -bottom-16 -left-8 h-64 w-64 rounded-full bg-amber-500/10 blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-lg">
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Get the app
            </h2>
            <p className="mt-4 text-lg text-cream-200/70">
              Be notified when iOS lands this November.
            </p>

            {status === 'success' ? (
              <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3 rounded-2xl border border-coral-500/30 bg-coral-500/10 px-6 py-4 text-coral-200">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-coral-500 text-white">
                  <Check className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <span className="text-sm font-medium">
                  You’re on the list. We’ll be in touch.
                </span>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <label htmlFor="cta-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="cta-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  placeholder="you@example.com"
                  className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-cream-200/40 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400/40 disabled:opacity-60"
                />
                <button type="submit" disabled={status === 'loading'} className="btn-primary group shrink-0 disabled:opacity-60">
                  {status === 'loading' ? 'Joining\u2026' : 'Notify me'}
                  {status !== 'loading' && (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              </form>
            )}

            {status === 'error' && (
              <p className="mx-auto mt-4 flex max-w-md items-center justify-center gap-2 text-sm text-red-300">
                <AlertCircle className="h-4 w-4" />
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
