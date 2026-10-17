import React, { useEffect, useState } from 'react';
import { ShieldCheck, Calendar, Clock, Terminal } from 'lucide-react';
import { apiClient } from '../../services/api.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';

export const PlacementAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/placement/audit-logs')
      .then((res) => setLogs(res.data.data.logs))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Retrieving institutional audit log records..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.25rem' }}>
          Administrative Audit Trail
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Immutable records of administrative account verification, recruitment drive creations, and role actions.
        </p>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Actor Identity</th>
                <th>Role</th>
                <th>Resource Target</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td>
                    <span className="badge badge-info" style={{ fontFamily: 'monospace' }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{log.actorEmail}</td>
                  <td>
                    <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                      {log.actorRole?.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {log.resourceType} {log.resourceId ? `(${log.resourceId.slice(-6)})` : ''}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                    {JSON.stringify(log.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
