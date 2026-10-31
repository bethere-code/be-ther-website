import { ArrowRight, Play } from 'lucide-react';

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.bether.app&hl=en_IN';

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden pt-20 pb-16 sm:pt-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/4 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-coral-500/12 blur-[140px]" />
        <div className="absolute right-[5%] bottom-1/4 h-72 w-72 rounded-full bg-amber-500/8 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="reveal eyebrow">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-coral-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-coral-400" />
            </span>
            Now live on Android
          </span>

          <h1 className="reveal mt-7 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-7xl">
            Be where your <span className="text-coral-400">people</span> are.
          </h1>

          <p className="reveal mx-auto mt-6 max-w-md text-lg leading-relaxed text-cream-200/70">
            A social calendar for the moments that bring people together.
          </p>

          <div className="reveal mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={PLAY_STORE}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-ink-800 px-6 py-3.5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink-700"
            >
              <Play className="h-6 w-6 fill-current" />
              <span className="flex flex-col items-start leading-tight">
                <span className="text-[10px] font-medium uppercase tracking-wider text-cream-200/60">
                  Get it on
                </span>
                <span className="font-display text-lg font-bold">Google Play</span>
              </span>
            </a>
            <a href="#how" className="btn-ghost group">
              How it works
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <p className="reveal mt-6 text-sm text-cream-200/40">
            iOS coming November 2026
          </p>
        </div>
      </div>
    </section>
  );
}
