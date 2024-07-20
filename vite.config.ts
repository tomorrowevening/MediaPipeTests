import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import glsl from 'vite-plugin-glsl';

// @ts-ignore
const dir = __dirname;

export default defineConfig({
  build: {
    assetsDir: '',
    cssMinify: true,
    minify: true,
    outDir: 'dist'
  },
  plugins: [glsl(), react()],
  resolve: {
    alias: {
      '@': path.resolve(dir, '/src'),
      '~@': path.resolve(dir, '/src'),
    }
  }
});
