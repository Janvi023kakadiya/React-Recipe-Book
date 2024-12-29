import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Vite's default port
    host: true, // needed for docker containers
    open: true, // open browser on server start
    cors: true, // enable CORS
    strictPort: true, // exit if port is already in use
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser', // better minification
    target: 'esnext', // modern browsers
    chunkSizeWarningLimit: 1000, // size in KB
  },
  resolve: {
    alias: {
      '@': '/src', // enable @ imports
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // pre-bundle these dependencies
  },
  css: {
    devSourcemap: true, // enable CSS source maps
  },
  preview: {
    port: 8080,
    strictPort: true,
  }
})
