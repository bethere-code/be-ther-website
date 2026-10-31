import { useState } from 'react';
import { ArrowLeft, Trash2, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { Logo } from './Logo';

type Status = 'idle' | 'loading' | 'done';

export function DeleteAccountPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const canSubmit =
    username.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== '' &&
    status !== 'loading';

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus('loading');
    // Simulated deletion for Play Store policy compliance demonstration.
    setTimeout(() => setStatus('done'), 1200);
  };

  return (
    <div className="min-h-screen bg-ink-950">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-950/80 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-cream-200/70 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to site</span>
          </a>
          <Logo />
        </div>
      </header>

      <main className="container-page py-16 sm:py-24">
        <article className="mx-auto max-w-xl">
          <p className="eyebrow">Account</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Delete Account
          </h1>
          <p className="mt-3 text-sm text-cream-200/50">
            Permanently remove your Be Ther account and associated data.
          </p>

          {status === 'done' ? (
            <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-coral-500/30 bg-coral-500/10 px-6 py-10 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-coral-500 text-white">
                <Check className="h-7 w-7" strokeWidth={2.5} />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold text-white">
                  Account deleted
                </h2>
                <p className="mt-2 text-sm text-cream-200/70">
                  Your account has been deleted. This is a demo confirmation message.
                </p>
              </div>
              <a href="/" className="btn-primary mt-2">
                Back to site
              </a>
            </div>
          ) : (
            <>
              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                <p className="text-sm leading-relaxed text-cream-200/70">
                  This action is irreversible. Deleting your account will permanently remove your
                  profile, saved events, and personal data from Be Ther.
                </p>
              </div>

              <form onSubmit={onSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="del-username" className="block text-sm font-medium text-cream-200/80">
                    Username
                  </label>
                  <input
                    id="del-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your_username"
                    className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-cream-200/40 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400/40"
                  />
                </div>

                <div>
                  <label htmlFor="del-email" className="block text-sm font-medium text-cream-200/80">
                    Email
                  </label>
                  <input
                    id="del-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-cream-200/40 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400/40"
                  />
                </div>

                <div>
                  <label htmlFor="del-password" className="block text-sm font-medium text-cream-200/80">
                    Password
                  </label>
                  <input
                    id="del-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-cream-200/40 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting account…
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete account
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-16 border-t border-white/10 pt-8">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-coral-400 transition-colors hover:text-coral-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Be Ther
            </a>
          </div>
        </article>
      </main>
    </div>
  );
}
