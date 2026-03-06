import React from 'react';
import Header from './Header';
import Footer from './Footer';

function Layout({ children }) {
  return (
    <>
      <Header />
      <main
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '3rem 1.5rem 4rem',
          flex: '1 1 auto',
        }}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
