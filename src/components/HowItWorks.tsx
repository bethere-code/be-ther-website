import { CalendarPlus, Share2, Ticket, Users } from 'lucide-react';

const steps = [
  {
    icon: CalendarPlus,
    step: '01',
    title: 'Post an event',
    body: 'Add the details — what, when, and where. Make it public to your circle or keep it to a private group.',
  },
  {
    icon: Share2,
    step: '02',
    title: 'Share it out',
    body: 'Send the invite to friends and family. They RSVP in a tap, no account gymnastics required.',
  },
  {
    icon: Users,
    step: '03',
    title: 'See who\u2019s going',
    body: 'Watch the attendee list fill up with familiar faces so everyone knows who they\u2019ll see there.',
  },
  {
    icon: Ticket,
    step: '04',
    title: 'Get your tickets',
    body: 'When there\u2019s a ticket to buy, grab it in the app. Your pass is saved with the event, ready at the door.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-20 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-coral-500/10 blur-[120px]" />
      </div>

      <div className="container-page">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="eyebrow">How it works</span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            From idea to “see you there” in four steps
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className="reveal relative card-dark p-6"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="font-display text-5xl font-bold text-white/5">{s.step}</span>
              <div className="-mt-6 grid h-11 w-11 place-items-center rounded-xl bg-coral-500 text-white shadow-glow">
                <s.icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-200/70">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
