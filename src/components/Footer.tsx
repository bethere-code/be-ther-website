import { Mail, Phone } from 'lucide-react';
import { Link } from '../hooks/usePathRoute';
import { Logo } from './Logo';

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.bether.app&hl=en_IN';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-950">
      <div className="container-page py-12">
        <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-cream-200/40">
              A social calendar for the moments that bring people together.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:items-end">
            <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Get the app
            </a>
            <div className="flex gap-5 text-sm text-cream-200/40">
              <Link to="/privacy" className="transition-colors hover:text-white">Privacy</Link>
              <Link to="/terms" className="transition-colors hover:text-white">Terms</Link>
              <Link to="/delete-account" className="transition-colors hover:text-white">Delete Account</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm font-medium text-cream-200/70">
                Gomatham Applications Private Limited
              </p>
              <p className="text-xs tracking-widest text-cream-200/40">ESTD 2026</p>
            </div>

            <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-6">
              <a
                href="tel:916003383"
                className="flex items-center gap-1.5 text-sm text-cream-200/60 transition-colors hover:text-white"
              >
                <Phone size={14} />
                916003383
              </a>
              <a
                href="mailto:be.there.accnts@gmail.com"
                className="flex items-center gap-1.5 text-sm text-cream-200/60 transition-colors hover:text-white"
              >
                <Mail size={14} />
                be.there.accnts@gmail.com
              </a>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-cream-200/40">
            © {new Date().getFullYear()} Be Ther. Made for the people who show up.
          </p>
        </div>
      </div>
    </footer>
  );
}
