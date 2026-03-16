import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Header() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Site name */}
        <Link
          to="/"
          style={{
            fontWeight: 600,
            fontSize: '0.9375rem',
            color: 'var(--color-text)',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}
        >
          Diego del Alamo
        </Link>

        {/* Navigation */}
        <nav>
          <ul
            style={{
              listStyle: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              padding: 0,
              margin: 0,
            }}
          >
            {[
              { to: '/', label: 'Home', external: false },
              { to: '/CV', label: 'CV', external: false },
            ].map(({ to, label, external }) => (
              <li key={label}>
                {external ? (
                  <a
                    href={to}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'var(--color-text-muted)',
                      textDecoration: 'none',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = 'var(--color-text)')
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = 'var(--color-text-muted)')
                    }
                  >
                    {label}
                  </a>
                ) : (
                  <NavLink
                    to={to}
                    end
                    style={({ isActive }) => ({
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                      textDecoration: 'none',
                      transition: 'color 0.15s ease',
                    })}
                    onMouseEnter={(e) =>
                      (e.target.style.color = 'var(--color-text)')
                    }
                    onMouseLeave={(e) => {
                      // Only reset if not active (NavLink handles active state via style prop)
                    }}
                  >
                    {label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
