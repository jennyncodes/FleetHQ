// components/Header.tsx
// Responsive navigation header with hamburger menu

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/trucks', label: 'Trucks', icon: '🚚' },
    { path: '/menu', label: 'Menu', icon: '📋' },
    { path: '/orders', label: 'Orders', icon: '💰' },
    { path: '/customers', label: 'Customers', icon: '👥' },
    { path: '/schedule', label: 'Schedule', icon: '📅' },
    { path: '/inventory', label: 'Inventory', icon: '📦' },
    { path: '/analytics', label: 'Analytics', icon: '📈' }
  ];

  return (
    <header style={{
      background: 'var(--white)',
      borderBottom: '2px solid var(--peach-light)',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/dashboard" style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--orange-primary)',
          textDecoration: 'none',
          fontFamily: 'var(--font-heading)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '2rem' }}>🚚</span>
          Fleet HQ
        </Link>

        {/* Desktop Navigation */}
        <nav style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }} className="desktop-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                color: isActive(item.path) ? 'var(--white)' : 'var(--gray-dark)',
                background: isActive(item.path) ? 'var(--orange-primary)' : 'transparent',
                fontWeight: isActive(item.path) ? 600 : 400,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'var(--peach-light)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="mobile-nav" style={{
          display: 'none',
          flexDirection: 'column',
          gap: '0.5rem',
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--peach-light)'
        }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                color: isActive(item.path) ? 'var(--white)' : 'var(--gray-dark)',
                background: isActive(item.path) ? 'var(--orange-primary)' : 'var(--peach-light)',
                fontWeight: isActive(item.path) ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .mobile-nav {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}