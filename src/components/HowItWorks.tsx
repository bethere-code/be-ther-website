import { CalendarPlus, Share2, Users } from 'lucide-react';

const steps = [
  {
    icon: CalendarPlus,
    step: '01',
    title: 'Post an event',
    body: 'Add the what, when, and where. Public or private — your call.',
  },
  {
    icon: Share2,
    step: '02',
    title: 'Share it out',
    body: 'Send the invite. Friends RSVP in a tap, no account needed.',
  },
  {
    icon: Users,
    step: '03',
    title: 'See who\u2019s going',
    body: 'Watch familiar faces fill the list. Then grab tickets if needed.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-20 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-coral-500/8 blur-[120px]" />
      </div>

      <div className="container-page">
        <div className="reveal mx-auto max-w-xl text-center">
          <span className="eyebrow">How it works</span>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Three steps. That’s it.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className="reveal relative card-dark p-7"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="font-display text-6xl font-bold text-white/5">{s.step}</span>
              <div className="-mt-7 grid h-12 w-12 place-items-center rounded-2xl bg-coral-500 text-white shadow-glow">
                <s.icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-200/60">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
