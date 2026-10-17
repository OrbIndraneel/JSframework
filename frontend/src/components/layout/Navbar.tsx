import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Bell, User, LogOut, ChevronDown, CheckCheck, Menu, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/index.js';
import { logoutUser } from '../../store/slices/authSlice.js';
import { fetchNotifications, fetchUnreadCount, markAllNotificationsRead } from '../../store/slices/notificationSlice.js';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: notifications, unreadCount } = useAppSelector((state) => state.notifications);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUnreadCount());
      const timer = setInterval(() => {
        dispatch(fetchUnreadCount());
      }, 30000);
      return () => clearInterval(timer);
    }
  }, [isAuthenticated, dispatch]);

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
    if (!showNotifications) {
      dispatch(fetchNotifications());
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'student':
        return '/student/dashboard';
      case 'recruiter':
        return '/recruiter/dashboard';
      case 'placement_officer':
        return '/placement/dashboard';
      case 'alumni':
        return '/alumni/dashboard';
      default:
        return '/';
    }
  };

  return (
    <header
      style={{
        background: '#ffffff',
        borderBottom: '1px solid var(--surface-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '68px',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontWeight: 700,
            fontSize: '1.25rem',
            color: 'var(--navy-900)',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(37,99,235,0.25)',
            }}
          >
            <GraduationCap size={22} />
          </div>
          <span style={{ letterSpacing: '-0.02em' }}>
            Campus<span style={{ color: 'var(--primary-600)' }}>Connect</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem',
            fontSize: '0.9rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
          }}
          className="desktop-nav"
        >
          <Link to="/jobs" style={{ transition: 'color 0.15s' }}>
            Browse Openings
          </Link>
          <Link to="/alumni/directory" style={{ transition: 'color 0.15s' }}>
            Alumni Network
          </Link>
          <Link to="/events" style={{ transition: 'color 0.15s' }}>
            Workshops & Drives
          </Link>
        </nav>

        {/* Right Section: Auth controls or Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated && user ? (
            <>
              {/* Portal Dashboard Shortcut */}
              <Link
                to={getDashboardPath()}
                className="btn btn-outline-primary btn-sm"
                style={{ textTransform: 'capitalize' }}
              >
                {user.role.replace('_', ' ')} Portal
              </Link>

              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={handleOpenNotifications}
                  style={{
                    background: 'var(--surface-muted)',
                    border: '1px solid var(--surface-border)',
                    borderRadius: '50%',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    position: 'relative',
                  }}
                  title="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-3px',
                        right: '-3px',
                        background: '#ef4444',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '46px',
                      width: '340px',
                      background: '#ffffff',
                      border: '1px solid var(--surface-border)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      padding: '0.75rem',
                      zIndex: 100,
                      maxHeight: '400px',
                      overflowY: 'auto',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: '0.5rem',
                        borderBottom: '1px solid var(--surface-border)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => dispatch(markAllNotificationsRead())}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary-600)',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <CheckCheck size={14} /> Mark all read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '1.5rem 0' }}>
                        No notifications yet.
                      </p>
                    ) : (
                      notifications.slice(0, 6).map((n) => (
                        <div
                          key={n._id}
                          style={{
                            padding: '0.5rem',
                            borderRadius: '6px',
                            background: n.isRead ? 'transparent' : 'var(--primary-50)',
                            marginBottom: '0.35rem',
                            fontSize: '0.8rem',
                          }}
                        >
                          <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{n.title}</div>
                          <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{n.message}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '4px' }}>
                            {new Date(n.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--primary-100)',
                      color: 'var(--primary-700)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                    }}
                  >
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </button>

                {showUserMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '46px',
                      width: '200px',
                      background: '#ffffff',
                      border: '1px solid var(--surface-border)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      padding: '0.5rem',
                      zIndex: 100,
                    }}
                  >
                    <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--surface-border)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--navy-900)' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                        {user.role.replace('_', ' ')}
                      </div>
                    </div>
                    <Link
                      to={getDashboardPath()}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-main)',
                        borderRadius: '4px',
                      }}
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.5rem',
                        fontSize: '0.85rem',
                        color: '#ef4444',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderRadius: '4px',
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-main)',
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};
