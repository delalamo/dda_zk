// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // Import the Layout component
import GhostBlogPage from './pages/GhostBlogPage';
import CVPage from './pages/CVPage';
import { MathJaxContext } from 'better-react-mathjax';

function App() {
  return (
    <Layout>
      {' '}
      {/* Wrap all routes/pages in the Layout */}
      <MathJaxContext>
        <Routes>
          {/* Route for the Ghost blog embed */}
          <Route path="/" element={<GhostBlogPage />} />

          {/* Route for the CV page */}
          <Route path="/CV" element={<CVPage />} />

          {/* Optional: Add a catch-all 404 route */}
          <Route
            path="*"
            element={
              <div>
                <h2>404 - Page Not Found</h2>
              </div>
            }
          />
        </Routes>
      </MathJaxContext>
    </Layout>
  );
}

export default App;
