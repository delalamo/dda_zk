import React from 'react';

// Replace this with your Ghost blog URL (e.g., "https://yourblog.ghost.io" or your custom domain)
const GHOST_BLOG_URL = 'https://biomlzk.ghost.io/';

function GhostBlogPage() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '56px', // header height
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
      }}
    >
      <iframe
        src={GHOST_BLOG_URL}
        title="Blog"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
        }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export default GhostBlogPage;
