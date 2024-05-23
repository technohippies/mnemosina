import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    solidPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['images/favicon.svg', 'images/icon-192x192.png', 'images/icon-512x512.png', 'images/icon-512x512-maskable.png'],
      manifest: {
        name: 'Rocbox',
        short_name: 'Rocbox',
        theme_color: '#161222',
        icons: [
          {
            src: '/images/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/images/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/images/icon-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
      },
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['solid-js', 'solid-js/web']
        }
      }
    }
  }
});