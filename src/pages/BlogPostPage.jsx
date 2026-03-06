import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { findPostById } from '../blog-posts/posts';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function BlogPostPage() {
  const { postId } = useParams();
  const post = findPostById(postId);

  if (!post) {
    return (
      <div>
        <h2 style={{ marginBottom: '0.75rem' }}>Post not found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          Sorry, we couldn&apos;t find the post you were looking for.
        </p>
        <Link
          to="/"
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          &larr; All posts
        </Link>
      </div>
    );
  }

  return (
    <article>
      {/* Back link */}
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '0.8125rem',
          color: 'var(--color-text-muted)',
          textDecoration: 'none',
          marginBottom: '2rem',
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={(e) => (e.target.style.color = 'var(--color-text)')}
        onMouseLeave={(e) => (e.target.style.color = 'var(--color-text-muted)')}
      >
        &larr; All posts
      </Link>

      {/* Title */}
      <h1
        style={{
          fontSize: '1.625rem',
          fontWeight: 700,
          lineHeight: 1.25,
          letterSpacing: '-0.015em',
          marginBottom: '0.75rem',
          marginTop: '0.5rem',
        }}
      >
        {post.title}
      </h1>

      {/* Meta row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          marginBottom: '2.5rem',
        }}
      >
        <time
          dateTime={post.date}
          style={{
            fontSize: '0.8125rem',
            fontFamily: "'Courier New', monospace",
            color: 'var(--color-text-muted)',
          }}
        >
          {formatDate(post.date)}
        </time>
        {post.category && (
          <span className="post-badge">{post.category}</span>
        )}
      </div>

      {/* Post content */}
      <div style={{ lineHeight: 1.8 }}>{post.content}</div>

      {/* Divider + back link */}
      <hr style={{ margin: '3rem 0 1.5rem' }} />
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '0.875rem',
          color: 'var(--color-text-muted)',
          textDecoration: 'none',
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={(e) => (e.target.style.color = 'var(--color-text)')}
        onMouseLeave={(e) => (e.target.style.color = 'var(--color-text-muted)')}
      >
        &larr; All posts
      </Link>
    </article>
  );
}

export default BlogPostPage;
