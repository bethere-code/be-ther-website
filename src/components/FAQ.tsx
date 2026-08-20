import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What is Be Ther?',
    a: 'Be Ther is a social calendar app. You post upcoming events, share them with friends and family, buy tickets when needed, and see who else is going — all in one place.',
  },
  {
    q: 'Is Be Ther free to use?',
    a: 'Yes. Creating an account, posting events, and sharing invites is free. You only pay for tickets when an event charges for entry.',
  },
  {
    q: 'Where can I download it?',
    a: 'Be Ther is available on iOS and Android. Enter your email in the Get the app section and we\u2019ll send you a download link.',
  },
  {
    q: 'Who can see my events?',
    a: 'You choose. Share with a private group of friends and family, or open it up to your wider circle. You\u2019re always in control of who sees what.',
  },
  {
    q: 'How do tickets work?',
    a: 'When an event requires a ticket, you can buy it directly in the app. Your pass is saved with the event details and ready to show at the door.',
  },
  {
    q: 'Is my information safe?',
    a: 'We take privacy seriously. You can read our Privacy Policy and Terms of Service for the full details on how we handle your data.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 sm:py-28">
      <div className="container-page">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="eyebrow">FAQ</span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Questions, answered
          </h2>
        </div>

        <div className="reveal mx-auto mt-12 max-w-3xl space-y-3">
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
                    <p className="px-6 pb-5 text-sm leading-relaxed text-cream-200/70">{f.a}</p>
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
