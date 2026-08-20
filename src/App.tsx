import { useReveal } from './hooks/useReveal';
import { usePathRoute } from './hooks/usePathRoute';
import { useEffect } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { EventMarquee } from './components/EventMarquee';
import { AppInstall } from './components/AppInstall';
import { HowItWorks } from './components/HowItWorks';
import { Community } from './components/Community';
import { FAQ } from './components/FAQ';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { PrivacyPage, TermsPage } from './components/LegalPages';
import { AdminApp } from './admin/AdminApp';

function App() {
  const route = usePathRoute();
  useReveal(route);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash === 'privacy' || hash === 'terms') {
      window.history.replaceState({}, '', `/${hash}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, []);

  if (route.startsWith('/admin')) return <AdminApp path={route} />;
  if (route === '/privacy') return <PrivacyPage />;
  if (route === '/terms') return <TermsPage />;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950">
      <Nav />
      <main>
        <Hero />
        <EventMarquee />
        <AppInstall />
        <HowItWorks />
        <Community />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
