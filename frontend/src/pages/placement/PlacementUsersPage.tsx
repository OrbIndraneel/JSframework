import React, { useEffect, useState } from 'react';
import { Search, ShieldCheck, ShieldAlert, Check, X, UserX, UserCheck } from 'lucide-react';
import { apiClient } from '../../services/api.js';
import { User } from '../../types/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';

export const PlacementUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 30 };
      if (search) params.search = search;
      if (roleFilter !== 'all') params.role = roleFilter;
      if (verifiedFilter !== 'all') params.isVerified = verifiedFilter;

      const res = await apiClient.get('/placement/users', { params });
      setUsers(res.data.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, verifiedFilter]);

  const handleVerifyToggle = async (user: User) => {
    setActionLoadingId(user.id || (user as any)._id);
    try {
      await apiClient.patch(`/placement/users/${user.id || (user as any)._id}/verify`, {
        isVerified: !user.isVerified,
      });
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update verification status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleActiveToggle = async (user: User) => {
    setActionLoadingId(user.id || (user as any)._id);
    try {
      await apiClient.patch(`/placement/users/${user.id || (user as any)._id}/toggle-active`);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user active status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.25rem' }}>
          User Directory & Verification Administration
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Verify recruiter corporate credentials, activate alumni mentors, and supervise student accounts.
        </p>
      </div>

      {/* Filter toolbar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by user name or email..."
              style={{ paddingLeft: '38px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
            />
          </div>

          <div style={{ minWidth: '160px' }}>
            <select className="form-control" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="recruiter">Recruiters</option>
              <option value="alumni">Alumni</option>
              <option value="placement_officer">Placement Officers</option>
            </select>
          </div>

          <div style={{ minWidth: '160px' }}>
            <select className="form-control" value={verifiedFilter} onChange={(e) => setVerifiedFilter(e.target.value)}>
              <option value="all">All Verification</option>
              <option value="true">Verified Only</option>
              <option value="false">Unverified / Pending</option>
            </select>
          </div>

          <button onClick={fetchUsers} className="btn btn-secondary btn-sm">
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading user directory..." />
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User Identity</th>
                  <th>Role</th>
                  <th>Verification</th>
                  <th>Account Status</th>
                  <th>Registered</th>
                  <th>Administrative Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const uid = u.id || (u as any)._id;
                  const isActing = actionLoadingId === uid;

                  return (
                    <tr key={uid}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{u.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                      </td>
                      <td>
                        <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.isVerified ? 'badge-success' : 'badge-warning'}`}>
                          {u.isVerified ? '✓ Verified' : 'Pending Review'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.isActive !== false ? 'badge-success' : 'badge-danger'}`}>
                          {u.isActive !== false ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            disabled={isActing}
                            onClick={() => handleVerifyToggle(u)}
                            className={`btn btn-sm ${u.isVerified ? 'btn-secondary' : 'btn-primary'}`}
                            title={u.isVerified ? 'Revoke Verification' : 'Verify Account'}
                          >
                            {u.isVerified ? <X size={14} /> : <Check size={14} />}
                            {u.isVerified ? 'Revoke' : 'Verify'}
                          </button>

                          <button
                            disabled={isActing || u.role === 'placement_officer'}
                            onClick={() => handleActiveToggle(u)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: u.isActive !== false ? '#ef4444' : '#10b981' }}
                            title={u.isActive !== false ? 'Suspend User' : 'Reactivate User'}
                          >
                            {u.isActive !== false ? <UserX size={14} /> : <UserCheck size={14} />}
                            {u.isActive !== false ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
