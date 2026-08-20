import { Logo } from './Logo';
import { Link } from '../hooks/usePathRoute';

const groups = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how' },
      { label: 'Get the app', href: '#get-the-app' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Contact Us', href: 'mailto:be.there.accnts@gmail.com' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-950">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-200/50">
              A social calendar for the moments that bring people together. Plan together. Show up
              together.
            </p>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-cream-200/80">
                {g.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {g.links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith('/') ? (
                      <Link
                        to={l.href}
                        className="text-sm text-cream-200/50 transition-colors hover:text-white"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        className="text-sm text-cream-200/50 transition-colors hover:text-white"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-cream-200/50">
            © {new Date().getFullYear()} Be Ther. All rights reserved.
          </p>
          <p className="text-xs text-cream-200/50">
            Made for the people who show up.
          </p>
        </div>
      </div>
    </footer>
  );
}
