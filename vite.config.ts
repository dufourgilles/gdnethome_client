import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    host: "::",
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://192.168.1.9:8000', // your backend URL
        changeOrigin: true,
        secure: false,
      },
      '/socketio': {
        target: 'http://192.168.1.9:8000',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    },
  },
  plugins: [
    react()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    }
  },
  build: {
    outDir: 'build'
  }
});
