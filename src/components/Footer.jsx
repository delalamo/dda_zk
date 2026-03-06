import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
            margin: 0,
          }}
        >
          &copy; {currentYear} Diego del Alamo, PhD
        </p>
      </div>
    </footer>
  );
}

export default Footer;
