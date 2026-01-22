import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Allow base path to be overridden via env for GitHub Pages
const base = process.env.BASE_PATH || '/RealAIResumeBuilder/';

export default defineConfig({
  base,
  plugins: [react()],
});
