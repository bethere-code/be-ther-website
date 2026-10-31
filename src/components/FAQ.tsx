import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What is Be Ther?',
    a: 'A social calendar app. Post events, share them with your circle, and see who\u2019s going — all in one place.',
  },
  {
    q: 'Is it free?',
    a: 'Yes. Creating an account and posting events is free. You only pay for tickets when an event charges for entry.',
  },
  {
    q: 'Where can I get it?',
    a: 'Be Ther is live on Android via the Google Play Store. The iOS app arrives in November 2026.',
  },
  {
    q: 'Who can see my events?',
    a: 'You choose. Share with a private group or open it up to your wider circle. You\u2019re always in control.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 sm:py-28">
      <div className="container-page">
        <div className="reveal mx-auto max-w-xl text-center">
          <span className="eyebrow">FAQ</span>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Good to know
          </h2>
        </div>

        <div className="reveal mx-auto mt-12 max-w-2xl space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={`card-dark overflow-hidden transition-colors ${
                  isOpen ? 'border-coral-500/30' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base font-semibold text-white">{f.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-coral-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-cream-200/60">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
