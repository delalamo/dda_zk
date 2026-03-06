import React, { useState, useMemo } from 'react';
import BlogPostPreview from '../components/BlogPostPreview';
import { posts } from '../blog-posts/posts';

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const allDefined = posts.map((post) => post.category).filter(Boolean);
    const unique = [...new Set(allDefined)];
    unique.sort((a, b) => a.localeCompare(b));
    return ['All', ...unique];
  }, []);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return posts;
    return posts.filter((post) => post.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div>
      {/* Category filters */}
      <div className="category-filters">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`category-btn${selectedCategory === category ? ' active' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Post list */}
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <BlogPostPreview key={post.id} post={post} />
        ))
      ) : (
        <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
          No posts found in &ldquo;{selectedCategory}&rdquo;.
        </p>
      )}

      {/* Attribution */}
      <p
        style={{
          marginTop: '3rem',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          fontStyle: 'italic',
        }}
      >
        This site has been entirely built by vibe coding with Gemini Pro.
      </p>
    </div>
  );
}

export default HomePage;
