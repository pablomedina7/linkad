import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'dist', // Directorio de salida para la construcción
    rollupOptions: {
      input: 'index.html', // Archivo de entrada
    },
  },
});
