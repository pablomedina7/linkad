import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Define la base de tu aplicación
  plugins: [react()],
});
