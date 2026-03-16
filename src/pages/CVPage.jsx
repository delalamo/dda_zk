import React from 'react';
import ReactMarkdown from 'react-markdown'; // Import the component
import remarkGfm from 'remark-gfm'; // Import the GFM plugin
// Import the raw Markdown content from your file
// Adjust the relative path based on your file structure!
import cvMarkdown from '/src/assets/CV.md?raw';

// Optional: Add some basic styling for the rendered Markdown
import './CV.css'; // Create this CSS file if you want custom styles

function CVPage() {
  return (
    <div className="cv-content"> {/* Add a class for styling */}
      <h1>Diego del Alamo, PhD</h1>
      {/* Render the imported Markdown string */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {cvMarkdown}
      </ReactMarkdown>
    </div>
  );
}

export default CVPage;
