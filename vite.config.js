import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://desarrollowebintegrado-1.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/producto': {
        target: 'https://desarrollowebintegrado-1.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

