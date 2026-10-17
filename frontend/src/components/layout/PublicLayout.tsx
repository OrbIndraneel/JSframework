import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.js';
import { Footer } from './Footer.js';

export const PublicLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, backgroundColor: 'var(--surface-bg)' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
