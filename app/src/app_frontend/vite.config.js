import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, './assets'), // IMPORTANT: this is where your built files go
    emptyOutDir: true,
  },
});
