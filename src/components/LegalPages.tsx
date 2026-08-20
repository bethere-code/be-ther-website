import { ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';
import { Link } from '../hooks/usePathRoute';

const sections = [
  {
    n: '1',
    title: 'Information We Collect',
    body: [
      'We collect information to power the Be Ther social calendar and event discovery experience:',
    ],
    items: [
      ['Account Information', 'Name, email address, phone number, and profile details created upon registration.'],
      ['User Content & Activity', 'Events you create, host, save, or mark as "Show Interest", as well as private event links, RSVPs, and social tags (such as Mutuals).'],
      ['Location Data', 'If granted permission, precise or approximate location data to display nearby events and regional feeds.'],
      ['Usage & Device Data', 'Device model, operating system version, app usage statistics, and unique device identifiers to optimize grid performance and list virtualization.'],
    ],
  },
  {
    n: '2',
    title: 'How We Use Your Information',
    items: [
      ['', 'To display your chronological event grid, manage event attendance, and signal interest to organizers.'],
      ['', 'To facilitate social verification features (e.g., displaying mutual connections or presence indicators).'],
      ['', 'To process B2B event organizer interactions, ticketing redirects, and analytical insights.'],
      ['', 'To detect, prevent, and address technical issues, spam, or Terms of Service violations.'],
    ],
  },
  {
    n: '3',
    title: 'Data Sharing & Disclosure',
    items: [
      ['Public/Social Visibility', 'Events set to public, "Show Interest" signals, and profile names may be visible to other Be Ther users depending on your privacy settings.'],
      ['B2B Event Organizers', 'If you express interest in or purchase tickets for a third-party/organized event, aggregate or necessary interaction data may be shared with the verified organizer.'],
      ['No Third-Party Sale', 'We do not sell your personal data to data brokers or third-party advertisers.'],
    ],
  },
  {
    n: '4',
    title: 'Data Retention & Account Deletion',
    body: [
      'You have full control over your data. You may request account deletion directly within the app settings. Upon deletion:',
    ],
    items: [
      ['', 'Your profile, saved events, and personal identification will be permanently purged from our primary database within 30 days.'],
      ['', 'Disaggregated or anonymized usage metrics may be retained for system analytical integrity.'],
    ],
  },
];

export function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="August 2026" sections={sections} />
  );
}

export function TermsPage() {
  const termsSections = [
    {
      n: '1',
      title: 'Acceptance of Terms',
      body: ['By downloading, accessing, or using Be Ther, you agree to be bound by these Terms. If you do not agree, do not use the application.'],
    },
    {
      n: '2',
      title: 'User Accounts & Responsibilities',
      items: [
        ['', 'You are responsible for maintaining the confidentiality of your login credentials.'],
        ['', 'You must provide accurate information when creating an account.'],
        ['', 'You must be at least 13 years of age (or the legal age of digital consent in your jurisdiction) to use Be Ther.'],
      ],
    },
    {
      n: '3',
      title: 'User-Generated Content (UGC) & Conduct Guidelines',
      body: ['Be Ther operates a zero-tolerance policy for abusive, illegal, harassing, hate speech, or sexually explicit content.'],
      items: [
        ['Hosting Events', 'When creating private or public events, you warrant that the event does not promote unlawful acts, fraudulent ticketing, or unpermitted gatherings.'],
        ['Reporting & Blocking', 'Users have built-in mechanisms to block abusive accounts and report harmful content or illegitimate events. We reserve the right to review reported content and remove events or ban accounts without prior notice.'],
      ],
    },
    {
      n: '4',
      title: 'B2B & External Event Listings',
      items: [
        ['', 'Be Ther may feature external links or integration points for third-party event ticketing and organizer platforms.'],
        ['', 'Be Ther is not responsible for event cancellations, venue issues, ticket refunds, or third-party organizer conduct. Transactions conducted on external ticketing sites are governed solely by those respective third parties.'],
      ],
    },
    {
      n: '5',
      title: 'Intellectual Property',
      body: ['All rights, title, and interest in and to Be Ther (excluding user-provided event content)—including UI components, software architecture, branding, and design elements—remain the exclusive property of the platform.'],
    },
    {
      n: '6',
      title: 'Limitation of Liability',
      body: ['To the maximum extent permitted by law, Be Ther and its operators shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the app, attendance at events discovered via the app, or interactions with other users.'],
    },
  ];

  return <LegalLayout title="Terms of Service" updated="August 2026" sections={termsSections} />;
}

function LegalLayout({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { n: string; title: string; body?: string[]; items?: string[][] }[];
}) {
  return (
    <div className="min-h-screen bg-ink-950">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-950/80 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-cream-200/70 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to site</span>
          </Link>
          <Logo />
        </div>
      </header>

      <main className="container-page py-16 sm:py-24">
        <article className="mx-auto max-w-3xl">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-cream-200/50">Last Updated: {updated}</p>

          <div className="mt-12 space-y-12">
            {sections.map((s) => (
              <section key={s.n} className="reveal">
                <h2 className="flex items-baseline gap-3 font-display text-xl font-semibold text-white sm:text-2xl">
                  <span className="text-coral-400">{s.n}.</span>
                  {s.title}
                </h2>
                <div className="mt-4 space-y-3">
                  {s.body?.map((p, i) => (
                    <p key={i} className="leading-relaxed text-cream-200/70">{p}</p>
                  ))}
                  {s.items && (
                    <ul className="space-y-3">
                      {s.items.map(([label, desc], i) => (
                        <li key={i} className="leading-relaxed text-cream-200/70">
                          {label && <span className="font-semibold text-cream-100">{label}: </span>}
                          {desc}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 border-t border-white/10 pt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-coral-400 transition-colors hover:text-coral-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Be Ther
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
