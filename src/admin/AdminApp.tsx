import { getToken } from './api';
import { Login } from './Login';
import { Shell } from './Shell';

export function AdminApp({ path }: { path: string }) {
  const authed = Boolean(getToken());
  if (!authed) return <Login />;
  return <Shell path={path} />;
}
