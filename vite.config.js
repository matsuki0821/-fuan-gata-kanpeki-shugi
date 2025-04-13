import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        // ✅ ファイル名を index.html にリネームして明示
        index: path.resolve(__dirname, 'index.html'),
        privacy: path.resolve(__dirname, 'pages/privacy-policy.html'),
      },
    },
  },
});
