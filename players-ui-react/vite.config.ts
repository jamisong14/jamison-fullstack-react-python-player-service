import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Optional: Configure build output directory, server settings, etc.
  build: {
    outDir: 'build', // Matches CRA's default build folder
  },
  server: {
    open: true,
    port: 3000,
    proxy: {
      '/v1': {
        target: 'http://localhost:8080',
      }
    }
  },
  test: {
    environment: 'jsdom',
  }
});