import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.bether.app&hl=en_IN';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-ink-950/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between sm:h-18">
        <Logo />

        <div className="hidden items-center gap-3 md:flex">
          <a href="#how" className="rounded-full px-4 py-2 text-sm font-medium text-cream-200/80 transition-colors hover:text-white">
            How it works
          </a>
          <a href="#faq" className="rounded-full px-4 py-2 text-sm font-medium text-cream-200/80 transition-colors hover:text-white">
            FAQ
          </a>
          <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Get the app
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={`overflow-hidden border-t border-white/10 bg-ink-950/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 md:hidden ${
          open ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container-page flex flex-col gap-1 py-4">
          <a href="#how" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-medium text-cream-200 hover:bg-white/5 hover:text-white">
            How it works
          </a>
          <a href="#faq" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-medium text-cream-200 hover:bg-white/5 hover:text-white">
            FAQ
          </a>
          <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">
            Get the app
          </a>
        </div>
      </div>
    </header>
  );
}
