import { Apple, Play, Star } from 'lucide-react';

export function AppInstall() {
  return (
    <section id="features" className="relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral-500/12 blur-[120px]" />
        <div className="absolute right-[15%] top-1/4 h-64 w-64 rounded-full bg-amber-500/10 blur-[100px]" />
      </div>

      <div className="container-page">
        <div className="reveal mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="eyebrow">Get Be Ther</span>

          <div className="relative mt-10">
            <div className="absolute -inset-6 -z-10 rounded-full bg-gradient-to-b from-coral-500/25 to-transparent blur-2xl" />
            <img
              src="/WhatsApp_Image_2026-06-28_at_22.46.20_(1).jpeg"
              alt="Be Ther"
              className="h-40 w-auto rounded-3xl object-contain shadow-float sm:h-48"
              style={{ maxWidth: '180px' }}
            />
          </div>

          <h2 className="mt-10 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Be where your <span className="text-coral-400">people</span> are.
          </h2>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream-200/80">
            Download Be Ther and start planning with your circle today. Free to join, available on
            iOS and Android.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <StoreButton
              store="appstore"
              href="#"
              topLine="Download on the"
              bottomLine="App Store"
              icon={<Apple className="h-7 w-7" strokeWidth={1.5} />}
            />
            <StoreButton
              store="playstore"
              href="#"
              topLine="Get it on"
              bottomLine="Google Play"
              icon={<Play className="h-6 w-6" fill="currentColor" />}
            />
          </div>

          <div className="mt-7 flex items-center gap-2 text-cream-200/60">
            <div className="flex">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 text-amber-400" fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <span className="text-sm font-medium">Early access members</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function StoreButton({
  store,
  href,
  topLine,
  bottomLine,
  icon,
}: {
  store: 'appstore' | 'playstore';
  href: string;
  topLine: string;
  bottomLine: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-3 rounded-2xl border px-5 py-3 transition-all duration-300 hover:-translate-y-0.5 ${
        store === 'appstore'
          ? 'border-white/15 bg-white text-ink-950 hover:bg-cream-100'
          : 'border-white/15 bg-ink-800 text-white hover:bg-ink-700'
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="flex flex-col items-start leading-tight">
        <span className={`text-[10px] font-medium uppercase tracking-wider ${store === 'appstore' ? 'text-ink-950/60' : 'text-cream-200/60'}`}>
          {topLine}
        </span>
        <span className="font-display text-lg font-bold">{bottomLine}</span>
      </span>
    </a>
  );
}
