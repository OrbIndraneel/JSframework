import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.js';
import { Sidebar } from './Sidebar.js';

export const AppLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main
          style={{
            flex: 1,
            backgroundColor: 'var(--surface-bg)',
            padding: '2rem',
            overflowX: 'hidden',
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .sidebar-aside { display: none !important; }
        }
      `}</style>
    </div>
  );
};
