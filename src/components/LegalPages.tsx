import { ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';

type LegalSection = {
  n: string;
  title: string;
  body?: string[];
  items?: [string, string][];
  table?: { headers: string[]; rows: string[][] };
};

const privacySections: LegalSection[] = [
  {
    n: '1',
    title: 'Who we are',
    body: [
      'Be Ther ("Be Ther", "we", "us") is a social calendar app and website (be-ther.com) operated by Gomatham Applications Private Limited, Hyderabad, Telangana, India. Under India\u2019s Digital Personal Data Protection Act, 2023 ("DPDP Act") we are the Data Fiduciary for the personal data described here, and you are the Data Principal.',
      'Questions about your data: be.there.accnts@gmail.com or in the app under Settings \u2192 Privacy \u2192 Contact us.',
    ],
  },
  {
    n: '2',
    title: 'What we collect and why',
    body: ['We collect only what each feature needs. If you decline an optional item, the rest of Be Ther keeps working.'],
    table: {
      headers: ['Data', 'Examples', 'Why we need it', 'Required?'],
      rows: [
        ['Account details', 'Name, email, phone number, profile photo, username', 'Create your account, sign you in, let friends find you', 'Required (photo optional)'],
        ['Events you create', 'Title, date, time, venue, description, privacy setting, cover image', 'Show and share your events', 'Required to post events'],
        ['Social activity', 'RSVPs, "Show Interest", saved events, friends, mutuals, invites sent', 'Show who\u2019s going, power mutual-connection features', 'Required to use social features'],
        ['Location', 'Precise or approximate location', 'Show nearby events and regional feeds', 'Optional \u2014 only with device permission'],
        ['Ticket purchases', 'Event, ticket type, amount, transaction ID', 'Issue and store your pass, handle support and refunds', 'Required to buy tickets'],
        ['Payment details', 'Card/UPI details', 'Taking payment', 'Handled by our payment gateway partner; we never see or store full card or UPI details'],
        ['Device and usage', 'Device model, OS version, app version, crash logs, feature usage, device identifiers', 'Keep the app working, fix bugs, prevent spam and abuse', 'Required'],
        ['Waitlist email', 'Email entered on be-ther.com', 'Send your download link and occasional product updates', 'Optional'],
        ['Support and reports', 'Messages to us, content you report, blocks', 'Answer you and keep the community safe', 'Only when you contact us or report'],
      ],
    },
  },
  {
    n: '3',
    title: 'Your consent',
    body: [
      'When you sign up we show you a short notice listing the data above and its purposes, and ask for your consent before collecting it. Location and marketing emails each have their own separate opt-in.',
      'You can withdraw consent at any time, as easily as you gave it: Settings \u2192 Privacy (location, marketing), your phone\u2019s settings (device permissions), or by deleting your account. Withdrawal stops future processing; it does not undo processing already done lawfully. Some features may stop working once consent is withdrawn.',
      'We may also process data without consent where the DPDP Act allows it, for example to comply with law, a court order, or to respond to a medical emergency or threat to safety.',
      'You may also manage consent through a Consent Manager registered with the Data Protection Board of India, once that framework is live.',
    ],
  },
  {
    n: '4',
    title: 'Who can see your information',
    items: [
      ['Other users', 'Your name, profile photo, public events, RSVPs and "Show Interest" on events you can see, according to each event\u2019s privacy setting. Private events are visible only to people you invite.'],
      ['Event organisers', 'When you RSVP to, show interest in or buy a ticket for an organised event, the organiser receives your name and the details needed to admit you (and your email if you buy a ticket). Organisers are independent and must handle this data lawfully.'],
      ['Service providers (Data Processors)', 'Companies that host, store, analyse or process data for us under written contracts that require them to protect it and use it only on our instructions: Google Firebase (sign-in, database, file storage, hosting, analytics, crash reporting and push notifications) and our payment gateway partner (ticket payments).'],
      ['Authorities', 'When required by Indian law, a valid legal request, or to protect the safety of users or the public.'],
      ['Business transfers', 'If Be Ther is merged or acquired, data moves to the new owner under this policy, and we will tell you first.'],
    ],
    body: ['We do not sell your personal data and do not share it with advertisers or data brokers.'],
  },
  {
    n: '5',
    title: 'Where your data is stored',
    body: [
      'Your data is stored on Google Firebase servers in India. Some Firebase services, such as sign-in, analytics and crash reporting, may process data on Google servers outside India. We transfer data abroad only as permitted by the DPDP Act and any restrictions notified by the Government of India, and under contracts that require equivalent protection.',
    ],
  },
  {
    n: '6',
    title: 'How we protect it',
    body: ['We use reasonable security safeguards, including:'],
    items: [
      ['', 'Encryption in transit (TLS) and at rest'],
      ['', 'Role-based access so only staff who need data can reach it, with multi-factor authentication'],
      ['', 'Access logging and monitoring to detect and investigate unauthorised access; logs are kept for at least one year'],
      ['', 'Regular backups so data can be restored if it is lost or corrupted'],
      ['', 'Security clauses in every processor contract'],
    ],
  },
  {
    n: '7',
    title: 'If there is a data breach',
    body: [
      'If a breach affects your personal data, we will tell you without delay through the app and/or email: what happened, when, the likely impact on you, what we are doing about it, what you can do, and who to contact. We will also report it to the Data Protection Board of India as the DPDP Rules require.',
    ],
  },
  {
    n: '8',
    title: 'How long we keep data',
    table: {
      headers: ['Data', 'How long'],
      rows: [
        ['Account, events, social activity', 'While your account is active'],
        ['After you delete your account', 'Erased from live systems within 30 days and from backups within 90 days'],
        ['Location', 'Used to load nearby events; not stored on our servers beyond 24 hours'],
        ['Ticket and transaction records', '8 years, as required by Indian tax and accounting law'],
        ['Security and access logs', '1 year, as required by the DPDP Rules'],
        ['Waitlist email', 'Until you join, unsubscribe or 24 months, whichever is first'],
        ['Inactive accounts', 'If you have not used Be Ther for 3 years, we will warn you at least 48 hours before deleting the account'],
      ],
    },
    body: ['After these periods we delete data or anonymise it so it can no longer identify you. We may keep aggregated, anonymised statistics.'],
  },
  {
    n: '9',
    title: 'Your rights',
    body: ['Under the DPDP Act you can:'],
    items: [
      ['1', 'Access a summary of the personal data we hold about you and how we use it, and the identities of those we have shared it with'],
      ['2', 'Correct, complete or update inaccurate or incomplete data'],
      ['3', 'Erase your data when it is no longer needed for the purpose you gave it for (subject to legal retention)'],
      ['4', 'Withdraw consent (Section 3)'],
      ['5', 'Nominate someone to exercise your rights if you die or become incapable'],
      ['6', 'Raise a grievance with us, and then with the Data Protection Board of India'],
    ],
  },
  {
    n: '10',
    title: 'Children',
    body: [
      'Be Ther is for people aged 18 and over. We do not knowingly process the personal data of anyone under 18. If we learn that a user is under 18, we will delete the account and its data. If you believe a child is using Be Ther, contact be.there.accnts@gmail.com.',
    ],
  },
  {
    n: '11',
    title: 'Grievance Officer',
    body: [
      'Kalidas Gomatham, Grievance Officer, Gomatham Applications Private Limited. Email: be.there.accnts@gmail.com. Address: Hyderabad, Telangana, India.',
      'We acknowledge grievances within 48 hours and resolve them within 90 days. If you are not satisfied, you may complain to the Data Protection Board of India.',
    ],
  },
  {
    n: '12',
    title: 'Cookies on be-ther.com',
    body: [
      'Our website uses only essential cookies needed for it to work. If we add analytics or marketing cookies, we will ask for your consent first.',
    ],
  },
  {
    n: '13',
    title: 'Changes to this policy',
    body: [
      'If we make material changes, we will notify you in the app or by email at least 7 days before they take effect and, where the change affects how we use your data, ask for your consent again.',
    ],
  },
  {
    n: '14',
    title: 'Language',
    body: [
      'This policy is available in English. On request, we will provide it in any language listed in the Eighth Schedule to the Constitution of India: email be.there.accnts@gmail.com.',
    ],
  },
];

const termsSections: LegalSection[] = [
  {
    n: '1',
    title: 'About these Terms',
    body: [
      'These Terms are an agreement between you and Gomatham Applications Private Limited, Hyderabad, Telangana, India ("Be Ther", "we", "us"), and govern your use of the Be Ther app and be-ther.com (the "Service"). By creating an account or using the Service you agree to these Terms and to our Privacy Policy, which explains how we handle your personal data. If you do not agree, do not use the Service.',
    ],
  },
  {
    n: '2',
    title: 'Who can use Be Ther',
    items: [
      ['', 'You must be at least 18 years old and able to enter a binding contract under Indian law.'],
      ['', 'You must not have been banned from the Service before.'],
      ['', 'If you use Be Ther for a business, venue or organisation, you confirm you are authorised to bind it to these Terms.'],
    ],
  },
  {
    n: '3',
    title: 'Your account',
    items: [
      ['', 'Give accurate information and keep it up to date.'],
      ['', 'Keep your login secure. Tell us at be.there.accnts@gmail.com if you think someone else has accessed your account.'],
      ['', 'One person, one personal account. Don\u2019t impersonate anyone or create accounts for others without their permission.'],
      ['', 'You can delete your account at any time in Settings \u2192 Account \u2192 Delete Account. What happens to your data is set out in the Privacy Policy.'],
    ],
  },
  {
    n: '4',
    title: 'Events and invites',
    items: [
      ['', 'You can post events as public, visible to your circle, or private to people you invite. You choose who sees each event.'],
      ['', 'When you invite people, you confirm you have a reasonable basis to share their details with us for that purpose.'],
      ['', 'Events must be real, lawful and accurately described. Don\u2019t post fake events, unlicensed gatherings, or events that promote anything illegal or dangerous.'],
    ],
  },
  {
    n: '5',
    title: 'Organisers',
    body: ['If you organise an event, sell tickets or receive attendee information through Be Ther:'],
    items: [
      ['', 'You are responsible for the event itself: venue, permits, safety, accessibility, accuracy of the listing, and any cancellation or change.'],
      ['', 'You will use attendee data only to run that event, keep it secure, and handle it in line with the DPDP Act and other applicable law. You are an independent Data Fiduciary for that data.'],
      ['', 'You will honour the refund terms you publish and any refund required by law.'],
    ],
  },
  {
    n: '6',
    title: 'Tickets and payments',
    items: [
      ['In-app tickets', 'When a ticket is sold in the app, payment is processed by our payment gateway partner. The organiser sets the price, any fees are shown before you pay, and your pass is saved with the event.'],
      ['External tickets', 'Some events link to third-party ticketing sites. Those purchases are governed by that site\u2019s terms and privacy policy, not ours.'],
      ['Refunds', 'If an event is cancelled, you are entitled to a refund under the organiser\u2019s policy and applicable law. Contact the organiser first; if they don\u2019t respond within 7 days, contact us at be.there.accnts@gmail.com and we will help.'],
      ['Free to use', 'Creating an account, posting events and sending invites is free. We will tell you clearly before charging for anything else.'],
    ],
  },
  {
    n: '7',
    title: 'Community rules',
    body: ['We have zero tolerance for:'],
    items: [
      ['', 'Harassment, bullying, threats, hate speech or discrimination'],
      ['', 'Sexually explicit content, or any content involving minors'],
      ['', 'Spam, scams, fraudulent ticketing or ticket touting'],
      ['', 'Content that infringes someone else\u2019s rights or breaks Indian law'],
      ['', 'Sharing another person\u2019s personal data without their permission'],
      ['', 'Attempts to hack, scrape, reverse-engineer or overload the Service'],
    ],
  },
  {
    n: '8',
    title: 'Your content',
    body: [
      'You own the content you post (event details, photos, comments). You give us a non-exclusive, royalty-free, worldwide licence to host, store, display and share it, only to operate and improve the Service and in line with your privacy settings. This licence ends when you delete the content or your account, except for copies other users have already received or that we must keep by law.',
    ],
  },
  {
    n: '9',
    title: 'Our intellectual property',
    body: [
      'The Be Ther name, logo, app, software, design and all other parts of the Service (excluding your content) belong to Gomatham Applications Private Limited. You may use the Service for its intended purpose; you may not copy, modify, resell or build a competing product from it.',
    ],
  },
  {
    n: '10',
    title: 'Third-party services',
    body: [
      'The Service links to or integrates with third parties (ticketing sites, maps, payment providers, app stores). We are not responsible for their content, services or practices.',
    ],
  },
  {
    n: '11',
    title: 'Disclaimers',
    body: [
      'Be Ther is a platform for discovering and sharing events. We do not organise, host or guarantee events listed by users or organisers, and we are not responsible for what happens at them. The Service is provided "as is"; we work to keep it running but do not promise it will always be available or error-free.',
    ],
  },
  {
    n: '12',
    title: 'Limitation of liability',
    body: [
      'To the extent permitted by law, we are not liable for indirect, incidental or consequential losses arising from your use of the Service, events you attend, or other users\u2019 conduct. Our total liability to you for any claim is limited to the greater of the amount you paid us in the 12 months before the claim or \u20B95,000. Nothing in these Terms limits liability that cannot be limited under Indian law, including rights under the Consumer Protection Act, 2019.',
    ],
  },
  {
    n: '13',
    title: 'Indemnity',
    body: [
      'You agree to compensate us for reasonable losses and legal costs caused by your breach of these Terms or your violation of law or someone else\u2019s rights.',
    ],
  },
  {
    n: '14',
    title: 'Suspension and termination',
    body: [
      'We may suspend or close your account if you seriously or repeatedly break these Terms or the law, or if we must to protect other users. Except in urgent cases, we will tell you why and give you a chance to respond. You can stop using Be Ther and delete your account at any time.',
    ],
  },
  {
    n: '15',
    title: 'Changes',
    body: [
      'We may update these Terms. For material changes we will notify you in the app or by email at least 7 days before they take effect. If you keep using Be Ther after that, the new Terms apply; if you don\u2019t agree, you can delete your account.',
    ],
  },
  {
    n: '16',
    title: 'Law, disputes and grievances',
    body: [
      'These Terms are governed by the laws of India. Courts in Hyderabad, Telangana have jurisdiction, subject to any consumer forum you are entitled to approach.',
      'For complaints, contact our Grievance Officer: Kalidas Gomatham, be.there.accnts@gmail.com, Hyderabad, Telangana, India. We acknowledge complaints within 48 hours and aim to resolve them within 15 days (privacy complaints within 90 days at most, as set out in the Privacy Policy).',
    ],
  },
  {
    n: '17',
    title: 'App store terms',
    body: [
      'If you downloaded Be Ther from the Apple App Store: these Terms are between you and us, not Apple; Apple has no obligation to provide support or maintenance; Apple is not responsible for product claims, and is a third-party beneficiary of these Terms who may enforce them against you. The same applies to Google for Google Play, to the extent its terms require.',
    ],
  },
  {
    n: '18',
    title: 'Contact',
    body: [
      'Gomatham Applications Private Limited \u00B7 Hyderabad, Telangana, India \u00B7 be.there.accnts@gmail.com',
    ],
  },
];

export function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="24 October 2026"
      effective="24 October 2026"
      sections={privacySections}
    />
  );
}

export function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated="24 October 2026"
      effective="24 October 2026"
      sections={termsSections}
    />
  );
}

function LegalLayout({
  title,
  updated,
  effective,
  sections,
}: {
  title: string;
  updated: string;
  effective: string;
  sections: LegalSection[];
}) {
  return (
    <div className="min-h-screen bg-ink-950">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-950/80 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-cream-200/70 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to site</span>
          </a>
          <Logo />
        </div>
      </header>

      <main className="container-page py-16 sm:py-24">
        <article className="mx-auto max-w-3xl">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-cream-200/50">
            Last updated: {updated} · Effective: {effective}
          </p>

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
                  {s.table && (
                    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-ink-800/40">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            {s.table.headers.map((h, i) => (
                              <th key={i} className="px-4 py-3 font-semibold text-cream-100 first:pl-5 last:pr-5">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {s.table.rows.map((row, i) => (
                            <tr key={i} className="border-b border-white/5 last:border-0">
                              {row.map((cell, j) => (
                                <td key={j} className="px-4 py-3 leading-relaxed text-cream-200/60 first:pl-5 last:pr-5">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {s.items && (
                    <ul className="space-y-3">
                      {s.items.map(([label, desc], i) => (
                        <li key={i} className="flex gap-3 leading-relaxed text-cream-200/70">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-400/60" />
                          <span>
                            {label && <span className="font-semibold text-cream-100">{label}: </span>}
                            {desc}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 border-t border-white/10 pt-8">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-coral-400 transition-colors hover:text-coral-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Be Ther
            </a>
          </div>
        </article>
      </main>
    </div>
  );
}
