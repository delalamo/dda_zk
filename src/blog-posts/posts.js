// src/blog-posts/posts.js

// Each content module exports metadata and a React element as `post`.
const postModules = import.meta.glob('./content/*.jsx', { eager: true });

// Process the imported modules into an array of post objects
export const posts = Object.values(postModules)
  .map((module) => module.post)
  .filter((post) => post !== undefined)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

// Helper function to find a post by its ID
export const findPostById = (id) => {
  return posts.find((post) => post.id === id);
};
