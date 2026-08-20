import { Quote } from 'lucide-react';

const quotes = [
  {
    quote:
      'I used to find out my friends went to a concert the day after. Now I see it on Be Ther, grab a ticket, and we go together.',
    name: 'Maya R.',
    role: 'Early access member',
  },
  {
    quote:
      'Our whole family plans birthdays and reunions in one calendar now. No more lost group texts.',
    name: 'Daniel K.',
    role: 'Family organizer',
  },
  {
    quote:
      'Seeing who\u2019s going before I buy the ticket is the whole thing. It takes the guesswork out of showing up.',
    name: 'Priya S.',
    role: 'Early access member',
  },
];

export function Community() {
  return (
    <section id="community" className="relative py-20 sm:py-28">
      <div className="container-page">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="eyebrow">Early community</span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            People are already planning with their circle
          </h2>
          <p className="mt-4 text-lg text-cream-200/80">
            Be Ther is in early access and the first members are putting it to work.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {quotes.map((q, i) => (
            <figure
              key={q.name}
              className="reveal card-dark flex flex-col p-6"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Quote className="h-7 w-7 text-coral-400/60" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-cream-100/90">
                "{q.quote}"
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-coral-400 to-coral-600 text-xs font-bold text-white">
                  {q.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{q.name}</span>
                  <span className="block text-xs text-cream-200/50">{q.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
