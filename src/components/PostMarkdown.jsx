import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Use Markdown for prose and ordinary React components between prose sections.
export default function PostMarkdown({ children, components }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}
