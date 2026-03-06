import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    open: true, // Automatically opens the app in the browser
  },
  build: {
    rollupOptions: {
      input: '/index.html', // Ensure index.html is the entry point
    },
  },
  publicDir: 'public',
});