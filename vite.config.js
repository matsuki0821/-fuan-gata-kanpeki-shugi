// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'pages/index.html'),
        privacy: path.resolve(__dirname, 'pages/privacy-policy.html'),
      },
    },
  },
});

