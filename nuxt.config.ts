// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      appName: process.env.APP_NAME,
      appDescription: process.env.APP_DESCRIPTION,
      appURL: process.env.APP_URL,
    },
  },
  ssr: false,
  modules: ['@vite-pwa/nuxt'],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: process.env.APP_NAME,
      short_name: process.env.APP_NAME,
      icons: [
        {
          "src": "/images/pwa-64x64.png",
          "sizes": "64x64",
          "type": "image/png"
        },
        {
          "src": "/images/pwa-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "/images/pwa-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        },
        {
          "src": "/images/maskable-icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        }
      ],
      start_url: '/',
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#111',
      theme_color: '#0AF',
      lang:'en',
      description: process.env.APP_DESCRIPTION,
    },
    includeAssets: [
      '/images/pwa/favicon.ico',
      '/images/pwa/apple-touch-icon.png',
      '/images/pwa/mask-icon.svg',
    ],
    workbox: {
      navigateFallback: '/',
    },
    devOptions: {
      enabled: true,
    },
  },  
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
})
