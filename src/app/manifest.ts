import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Creative Monk',
    short_name: 'Creative Monk',
    description: 'Top Digital Marketing Company in Chandigarh | Web Development, SEO, and Branding',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a1a1a',
    theme_color: '#FF6600',
    icons: [
      {
        src: '/images/icon-logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/icon-logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
