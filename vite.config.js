import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://54.210.224.54',
        changeOrigin: true,
        secure: false,
      },
      '/producto': {
        target: 'http://54.210.224.54',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

