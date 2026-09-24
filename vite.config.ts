import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 900,
    rolldownOptions: {
      output: {
        // Bibliothèques et catalogue dans des fichiers séparés : mis en cache d'un déploiement à l'autre.
        codeSplitting: {
          groups: [
            { name: 'vendor', test: /node_modules/ },
            { name: 'catalog', test: /src[\\/]data[\\/]catalog/ },
          ],
        },
      },
    },
  },
  test: {
    environment: 'node',
  },
} as never)
