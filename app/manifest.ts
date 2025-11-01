import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nomadiqe',
    short_name: 'Nomadiqe',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1220',
    theme_color: '#0ea5e9',
    description: 'Fairer stays, deeper connections.',
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { src: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ]
  }
}
