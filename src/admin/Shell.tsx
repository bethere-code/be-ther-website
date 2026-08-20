import {
  Activity,
  Flag,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  Users as UsersIcon,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { go, Link } from '../hooks/usePathRoute';
import { adminEmail, clearSession } from './api';
import {
  AnalyticsPage,
  OverviewPage,
  PostDetailPage,
  PostsPage,
  ReportsPage,
  UserDetailPage,
  UsersPage,
} from './pages';

const nav = [
  { to: '/admin/overview', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: UsersIcon },
  { to: '/admin/posts', label: 'Posts', icon: Image },
  { to: '/admin/analytics', label: 'Analytics', icon: Activity },
  { to: '/admin/reports', label: 'Reports', icon: Flag },
];

export function Shell({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const page = path.startsWith('/admin/users/') && path !== '/admin/users'
    ? 'user'
    : path.startsWith('/admin/posts/') && path !== '/admin/posts'
      ? 'post'
      : path.replace('/admin/', '') || 'overview';

  function logout() {
    clearSession();
    go('/admin');
  }

  return (
    <div className="admin-shell min-h-screen bg-cream-100 text-ink-950">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-56 border-r border-ink-950/10 bg-white pt-16 transition-transform md:static md:translate-x-0 ${
            open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <nav className="flex flex-col gap-1 p-3" aria-label="Admin">
            {nav.map((item) => {
              const active =
                item.to === '/admin/overview'
                  ? path === '/admin' || path === '/admin/overview'
                  : item.to === '/admin/posts'
                    ? path === '/admin/posts' || path.startsWith('/admin/posts/')
                    : path === item.to || path.startsWith(`${item.to}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex h-12 items-center gap-2 rounded-xl px-3 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 ${
                    active ? 'bg-coral-500 text-white' : 'text-ink-700 hover:bg-cream-100'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-ink-950/10 bg-white/90 px-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="grid h-12 w-12 place-items-center rounded-xl md:hidden"
                aria-label={open ? 'Close menu' : 'Open menu'}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <p className="text-sm font-semibold">Ops</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-ink-500 sm:inline">{adminEmail()}</span>
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-12 items-center gap-2 rounded-xl px-3 text-sm font-medium text-ink-700 hover:bg-cream-100"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Sign out
              </button>
            </div>
          </header>
          <main id="admin-main" className="p-4 md:p-6">
            {page === 'overview' || path === '/admin' ? <OverviewPage /> : null}
            {path === '/admin/users' ? <UsersPage /> : null}
            {page === 'user' ? <UserDetailPage id={path.split('/').pop() ?? ''} /> : null}
            {path === '/admin/posts' ? <PostsPage /> : null}
            {page === 'post' ? <PostDetailPage id={path.split('/').pop() ?? ''} /> : null}
            {path === '/admin/analytics' ? <AnalyticsPage /> : null}
            {path === '/admin/reports' ? <ReportsPage /> : null}
          </main>
        </div>
      </div>
    </div>
  );
}
