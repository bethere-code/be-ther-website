import { fmtDate, idOf } from '../api';
import { ListPage } from '../ListPage';
import { td } from '../ui';

export function ReportsPage() {
  return (
    <div className="space-y-10">
      <ListPage
        title="Event reports"
        path="/api/v1/admin/reports"
        columns={['Type', 'Reporter', 'Post', 'When']}
        render={(r) => {
          const reporter = r.reporterId as { username?: string } | undefined;
          const post = r.postId as { location?: string } | undefined;
          return (
            <>
              <td className={td}>{String(r.type)}</td>
              <td className={td}>@{String(reporter?.username ?? '')}</td>
              <td className={td}>{String(post?.location ?? idOf(r))}</td>
              <td className={td}>{fmtDate(r.createdAt as string)}</td>
            </>
          );
        }}
      />
      <ListPage
        title="Account reports"
        path="/api/v1/admin/user-reports"
        columns={['Reason', 'Reporter', 'Account', 'Details', 'When']}
        render={(r) => {
          const reporter = r.reporterId as { username?: string } | undefined;
          const reported = r.reportedUserId as { username?: string } | undefined;
          return (
            <>
              <td className={td}>{String(r.reason)}</td>
              <td className={td}>@{String(reporter?.username ?? '')}</td>
              <td className={td}>@{String(reported?.username ?? '')}</td>
              <td className={td}>{String(r.details ?? '')}</td>
              <td className={td}>{fmtDate(r.createdAt as string)}</td>
            </>
          );
        }}
      />
    </div>
  );
}
