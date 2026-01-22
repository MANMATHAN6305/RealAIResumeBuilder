import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative paths for GitHub Pages compatibility
  base: './',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
