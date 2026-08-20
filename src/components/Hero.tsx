import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-coral-500/15 blur-[120px]" />
        <div className="absolute right-[10%] top-1/3 h-72 w-72 rounded-full bg-amber-500/10 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow reveal">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-coral-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-coral-400" />
            </span>
            Now in early access
          </span>

          <h1 className="reveal mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl">
            Be where your <span className="text-coral-400">people</span> are.
          </h1>

          <p className="reveal mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cream-200/80">
            Be Ther is a social calendar for the moments that bring people together. Post upcoming
            events, share them with friends and family, grab tickets, and see who's going — all in
            one place.
          </p>

          <div className="reveal mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#get-the-app" className="btn-primary group">
              Get the app
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#how" className="btn-ghost">
              See how it works
            </a>
          </div>

          <p className="reveal mt-5 text-sm text-cream-200/50">
            Free to join. Available on iOS and Android.
          </p>
        </div>
      </div>
    </section>
  );
}
