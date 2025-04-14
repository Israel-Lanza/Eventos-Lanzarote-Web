import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  build: {
    chunkSizeWarningLimit: 1000, 
    rollupOptions: {
      output: {
        manualChunks: {
         
          react: ['react', 'react-dom'],
          vendor: ['axios', 'react-router-dom'], 
        },
      },
    },
  },
})
