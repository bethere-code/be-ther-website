import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export function CTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section id="get-the-app" className="relative py-20 sm:py-28">
      <div className="container-page">
        <div className="reveal relative overflow-hidden rounded-[2.5rem] border border-coral-500/20 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 px-6 py-14 sm:px-12 sm:py-16">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-coral-500/25 blur-[100px]" />
            <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-amber-500/15 blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Plan together. Show up together.
            </h2>
            <p className="mt-4 text-lg text-cream-200/80">
              Join the early access list and be one of the first to put Be Ther to work with your
              people.
            </p>

            {submitted ? (
              <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3 rounded-2xl border border-coral-500/30 bg-coral-500/10 px-6 py-4 text-coral-200">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-coral-500 text-white">
                  <Check className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <span className="text-sm font-medium">
                  You're on the list. We'll be in touch soon.
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
                  placeholder="you@example.com"
                  className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-cream-200/40 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400/40"
                />
                <button type="submit" className="btn-primary group shrink-0">
                  Join early access
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            )}

            <p className="mt-4 text-xs text-cream-200/50">
              No spam. Just a download link and the occasional update.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
