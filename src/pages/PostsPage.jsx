import BlogPostPreview from '../components/BlogPostPreview';
import { posts } from '../blog-posts/posts';

export default function PostsPage() {
  return (
    <section aria-labelledby="posts-title">
      <h1 id="posts-title">Posts</h1>
      {posts.length > 0 ? (
        posts.map((post) => <BlogPostPreview key={post.id} post={post} />)
      ) : (
        <p style={{ color: 'var(--color-text-muted)' }}>No posts yet.</p>
      )}
    </section>
  );
}
