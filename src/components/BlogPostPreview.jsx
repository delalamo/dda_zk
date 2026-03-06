import React from 'react';
import { Link } from 'react-router-dom';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function BlogPostPreview({ post }) {
  if (!post) return null;

  return (
    <article
      style={{
        paddingTop: '1.75rem',
        paddingBottom: '1.75rem',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {/* Meta row: date + category badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          marginBottom: '0.5rem',
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

      {/* Title */}
      <h2
        style={{
          fontSize: '1.0625rem',
          fontWeight: 600,
          lineHeight: 1.35,
          marginBottom: '0.5rem',
          marginTop: 0,
        }}
      >
        <Link
          to={`/post/${post.id}`}
          style={{
            color: 'var(--color-text)',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.target.style.color = 'var(--color-accent)')}
          onMouseLeave={(e) => (e.target.style.color = 'var(--color-text)')}
        >
          {post.title}
        </Link>
      </h2>

      {/* Excerpt */}
      {post.excerpt && (
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.65,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.excerpt}
        </p>
      )}
    </article>
  );
}

export default BlogPostPreview;
