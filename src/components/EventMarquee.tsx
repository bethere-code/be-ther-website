import { Music, TentTree, UtensilsCrossed, Trophy, PartyPopper, Mic2, Clapperboard, Heart } from 'lucide-react';

const types = [
  { label: 'Concerts', icon: Music },
  { label: 'Festivals', icon: PartyPopper },
  { label: 'Brunches', icon: UtensilsCrossed },
  { label: 'Game days', icon: Trophy },
  { label: 'Camping', icon: TentTree },
  { label: 'Open mic', icon: Mic2 },
  { label: 'Premieres', icon: Clapperboard },
  { label: 'Reunions', icon: Heart },
];

export function EventMarquee() {
  return (
    <section className="relative py-10">
      <div className="container-page">
        <p className="reveal text-center text-xs font-semibold uppercase tracking-[0.2em] text-cream-200/50">
          For every kind of get-together
        </p>
      </div>
      <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee gap-3">
          {[...types, ...types].map((t, i) => (
            <span
              key={`${t.label}-${i}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-cream-200/80"
            >
              <t.icon className="h-4 w-4 text-coral-400" />
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
