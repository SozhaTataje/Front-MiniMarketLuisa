import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://desarrollowebintegrado-13w4.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      '/producto': {
        target: 'https://desarrollowebintegrado-13w4.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});

